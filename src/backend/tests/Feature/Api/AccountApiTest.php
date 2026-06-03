<?php

use App\Models\Account;
use App\Models\Family;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
    Sanctum::actingAs($this->user);
});

test('RF05 - usuario pode listar contas', function () {
    Account::create([
        'familyId' => $this->family->id, 'name' => 'Conta Corrente',
        'type' => 'checking', 'balance' => 5000,
    ]);
    Account::create([
        'familyId' => $this->family->id, 'name' => 'Poupança',
        'type' => 'savings', 'balance' => 10000,
    ]);

    $response = $this->getJson('/api/accounts');

    $response->assertOk()->assertJsonCount(2);
});

test('RF05 - usuario pode criar conta', function () {
    $response = $this->postJson('/api/accounts', [
        'name' => 'Nova Conta',
        'type' => 'checking',
        'balance' => 2500.00,
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['name' => 'Nova Conta', 'balance' => 2500.0]);
});

test('RF05 - usuario pode ver conta pelo id', function () {
    $account = Account::create([
        'familyId' => $this->family->id, 'name' => 'Investimentos',
        'type' => 'investment', 'balance' => 50000,
    ]);

    $response = $this->getJson("/api/accounts/{$account->id}");

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Investimentos', 'balance' => 50000.0]);
});

test('RF05 - usuario pode atualizar conta', function () {
    $account = Account::create([
        'familyId' => $this->family->id, 'name' => 'Conta Antiga',
        'type' => 'checking', 'balance' => 100,
    ]);

    $response = $this->putJson("/api/accounts/{$account->id}", [
        'name' => 'Conta Atualizada',
        'balance' => 2000,
    ]);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Conta Atualizada', 'balance' => 2000.0]);
});

test('RF05 - usuario pode deletar conta', function () {
    $account = Account::create([
        'familyId' => $this->family->id, 'name' => 'Conta Inútil',
        'type' => 'cash', 'balance' => 0,
    ]);

    $response = $this->deleteJson("/api/accounts/{$account->id}");

    $response->assertOk();
    expect(Account::find($account->id))->toBeNull();
});

test('RF05 - criar conta com tipo invalido retorna erro', function () {
    $this->postJson('/api/accounts', [
        'name' => 'Conta Errada',
        'type' => 'invalid_type',
        'balance' => 100,
    ])->assertUnprocessable();
});

test('RF05 - usuario nao pode ver conta de outra familia', function () {
    $outraFamilia = Family::create(['name' => 'Outra Família']);
    $contaAlheia = Account::create([
        'familyId' => $outraFamilia->id, 'name' => 'Conta Alheia',
        'type' => 'checking', 'balance' => 999999,
    ]);

    $this->getJson("/api/accounts/{$contaAlheia->id}")->assertNotFound();
});

test('RF05 - contas retornam apenas da propria familia', function () {
    $outraFamilia = Family::create(['name' => 'Outra Família']);
    Account::create([
        'familyId' => $outraFamilia->id, 'name' => 'Conta Alheia',
        'type' => 'checking', 'balance' => 999999,
    ]);

    $response = $this->getJson('/api/accounts');

    expect($response->json())->toHaveCount(0);
});
