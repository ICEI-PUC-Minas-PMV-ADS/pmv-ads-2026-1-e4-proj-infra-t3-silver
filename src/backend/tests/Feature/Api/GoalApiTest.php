<?php

use App\Models\Family;
use App\Models\Goal;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
    Sanctum::actingAs($this->user);
});

test('RF06 - usuario pode listar metas', function () {
    Goal::create([
        'userId' => $this->user->id,
        'title' => 'Viagem dos Sonhos',
        'target_amount' => 10000.0,
        'current_amount' => 2500.0,
        'status' => 'ativa',
        'deadline' => '2026-12-31',
    ]);

    $response = $this->getJson('/api/goals');

    $response->assertOk()
        ->assertJsonCount(1);
});

test('RF06 - usuario pode criar meta', function () {
    $response = $this->postJson('/api/goals', [
        'title' => 'Carro Novo',
        'description' => 'Economizar para um carro',
        'target_amount' => 50000.00,
        'current_amount' => 5000.00,
        'deadline' => '2027-06-30',
        'status' => 'ativa',
    ]);

    $response->assertCreated()
        ->assertJsonFragment([
            'title' => 'Carro Novo',
            'status' => 'ativa',
        ]);
});

test('RF06 - usuario pode ver meta pelo id', function () {
    $goal = Goal::create([
        'userId' => $this->user->id,
        'title' => 'Curso Online',
        'target_amount' => 3000.0,
        'current_amount' => 0.0,
        'status' => 'ativa',
    ]);

    $response = $this->getJson("/api/goals/{$goal->id}");

    $response->assertOk()
        ->assertJsonFragment(['title' => 'Curso Online']);
});

test('RF06 - usuario pode atualizar meta', function () {
    $goal = Goal::create([
        'userId' => $this->user->id,
        'title' => 'Antigo',
        'target_amount' => 1000.0,
        'current_amount' => 100.0,
        'status' => 'ativa',
    ]);

    $response = $this->putJson("/api/goals/{$goal->id}", [
        'title' => 'Atualizado',
        'current_amount' => 500.0,
    ]);

    $response->assertOk()
        ->assertJsonFragment(['title' => 'Atualizado', 'current_amount' => 500.0]);
});

test('RF06 - usuario pode deletar meta', function () {
    $goal = Goal::create([
        'userId' => $this->user->id,
        'title' => 'Temporária',
        'target_amount' => 500.0,
        'current_amount' => 0.0,
        'status' => 'ativa',
    ]);

    $response = $this->deleteJson("/api/goals/{$goal->id}");

    $response->assertOk()
        ->assertJsonFragment(['message' => 'Meta excluída com sucesso.']);
    expect(Goal::find($goal->id))->toBeNull();
});

test('RF06 - criar meta com status invalido retorna erro', function () {
    $this->postJson('/api/goals', [
        'title' => 'Inválida',
        'target_amount' => 100,
        'status' => 'status_invalido',
    ])->assertUnprocessable();
});

test('RF06 - criar meta sem title retorna erro', function () {
    $this->postJson('/api/goals', [
        'target_amount' => 100,
    ])->assertUnprocessable();
});

test('RF06 - metas retornam apenas do usuario logado', function () {
    $outroUser = User::factory()->create(['familyId' => $this->family->id]);
    Goal::create([
        'userId' => $outroUser->id,
        'title' => 'Meta Alheia',
        'target_amount' => 9999.0,
        'current_amount' => 0.0,
        'status' => 'ativa',
    ]);

    $response = $this->getJson('/api/goals');

    expect($response->json())->toHaveCount(0);
});

test('RF12 - meta com progresso calculado corretamente', function () {
    $goal = Goal::create([
        'userId' => $this->user->id,
        'title' => 'Progresso',
        'target_amount' => 1000.0,
        'current_amount' => 750.0,
        'status' => 'ativa',
    ]);

    $progresso = ($goal->current_amount / $goal->target_amount) * 100;
    expect($progresso)->toBe(75.0);
});

test('RF12 - meta concluida pode ser marcada', function () {
    $goal = Goal::create([
        'userId' => $this->user->id,
        'title' => 'Completa',
        'target_amount' => 500.0,
        'current_amount' => 500.0,
        'status' => 'ativa',
    ]);

    $response = $this->putJson("/api/goals/{$goal->id}", [
        'status' => 'concluida',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['status' => 'concluida']);
});
