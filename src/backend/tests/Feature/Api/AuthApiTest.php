<?php

use App\Models\Family;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
});

test('RF07 - usuario pode se registrar via API', function () {
    $email = 'novo_' . uniqid() . '@teste.com';
    $response = $this->postJson('/api/register', [
        'name' => 'Novo Usuário',
        'email' => $email,
        'password' => '12345678',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['user', 'token', 'token_type'])
        ->assertJsonFragment(['token_type' => 'Bearer']);

    expect(User::where('email', $email)->exists())->toBeTrue();
});

test('RF07 - registro rejeita email duplicado', function () {
    $this->postJson('/api/register', [
        'name' => 'Outro',
        'email' => $this->user->email,
        'password' => '12345678',
    ])->assertUnprocessable();
});

test('RF07 - registro rejeita senha curta', function () {
    $this->postJson('/api/register', [
        'name' => 'Teste',
        'email' => 'teste@teste.com',
        'password' => '123',
    ])->assertUnprocessable();
});

test('RF07 - usuario pode fazer login via API', function () {
    $response = $this->postJson('/api/login', [
        'email' => $this->user->email,
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['user', 'token', 'token_type'])
        ->assertJsonFragment(['token_type' => 'Bearer']);
});

test('RF07 - login rejeita credenciais invalidas', function () {
    $this->postJson('/api/login', [
        'email' => $this->user->email,
        'password' => 'senha_errada',
    ])->assertUnprocessable();
});

test('RF07 - usuario autenticado pode ver seu perfil', function () {
    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/me');

    $response->assertOk()
        ->assertJsonFragment(['email' => $this->user->email]);
});

test('RF07 - usuario nao autenticado nao acessa /me', function () {
    $this->getJson('/api/me')->assertUnauthorized();
});
