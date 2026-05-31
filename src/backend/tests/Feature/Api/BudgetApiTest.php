<?php

use App\Models\Budget;
use App\Models\Category;
use App\Models\Family;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
    $this->category = Category::create([
        'familyId' => $this->family->id,
        'userId'   => $this->user->id,
        'name'     => 'Alimentação',
        'color'    => '#FF6B6B',
        'icon'     => 'utensils',
    ]);
    Sanctum::actingAs($this->user);
});

test('usuario autenticado pode listar seus orcamentos', function () {
    Budget::create([
        'familyId'    => $this->family->id,
        'userId'      => $this->user->id,
        'categoryId'  => $this->category->id,
        'monthYear'   => '2026-04',
        'limitAmount' => 800.00,
        'spentAmount' => 0.0,
    ]);

    $response = $this->getJson('/api/budgets');

    $response->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['monthYear' => '2026-04']);
});

test('usuario pode filtrar orcamentos por mes', function () {
    Budget::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'categoryId' => $this->category->id, 'monthYear' => '2026-04',
        'limitAmount' => 800.00, 'spentAmount' => 0.0,
    ]);
    Budget::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'categoryId' => $this->category->id, 'monthYear' => '2026-03',
        'limitAmount' => 700.00, 'spentAmount' => 0.0,
    ]);

    $response = $this->getJson('/api/budgets?monthYear=2026-04');

    $response->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['monthYear' => '2026-04']);
});

test('usuario pode criar um orcamento mensal', function () {
    $response = $this->postJson('/api/budgets', [
        'categoryId'  => $this->category->id,
        'monthYear'   => '2026-04',
        'limitAmount' => 800.00,
    ]);

    $response->assertCreated()
        ->assertJsonFragment([
            'monthYear'   => '2026-04',
            'limitAmount' => 800.0,
            'spentAmount' => 0.0,
        ]);

    $this->assertDatabaseHas('budgets', ['monthYear' => '2026-04']);
});

test('usuario pode buscar um orcamento pelo id', function () {
    $budget = Budget::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'categoryId' => $this->category->id, 'monthYear' => '2026-04',
        'limitAmount' => 500.00, 'spentAmount' => 0.0,
    ]);

    $response = $this->getJson("/api/budgets/{$budget->id}");

    $response->assertOk()
        ->assertJsonFragment(['limitAmount' => 500.0]);
});

test('usuario pode atualizar o limite de um orcamento', function () {
    $budget = Budget::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'categoryId' => $this->category->id, 'monthYear' => '2026-04',
        'limitAmount' => 500.00, 'spentAmount' => 0.0,
    ]);

    $response = $this->putJson("/api/budgets/{$budget->id}", [
        'limitAmount' => 1200.00,
    ]);

    $response->assertOk()
        ->assertJsonFragment(['limitAmount' => 1200.0]);
});

test('usuario pode deletar um orcamento', function () {
    $budget = Budget::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'categoryId' => $this->category->id, 'monthYear' => '2026-04',
        'limitAmount' => 500.00, 'spentAmount' => 0.0,
    ]);

    $response = $this->deleteJson("/api/budgets/{$budget->id}");

    $response->assertOk()
        ->assertJsonFragment(['message' => 'Orçamento removido com sucesso.']);

    $this->assertDatabaseMissing('budgets', ['_id' => $budget->id]);
});

test('usuario nao pode acessar orcamento de outra familia', function () {
    $outraFamilia = Family::create(['name' => 'Outra Família']);
    $outraUser = User::factory()->create(['familyId' => $outraFamilia->id]);
    $outraCategoria = Category::create([
        'familyId' => $outraFamilia->id, 'userId' => $outraUser->id,
        'name' => 'Transporte', 'color' => '#000000', 'icon' => 'car',
    ]);

    $budgetAlheio = Budget::create([
        'familyId' => $outraFamilia->id, 'userId' => $outraUser->id,
        'categoryId' => $outraCategoria->id, 'monthYear' => '2026-04',
        'limitAmount' => 300.00, 'spentAmount' => 0.0,
    ]);

    $response = $this->getJson("/api/budgets/{$budgetAlheio->id}");

    $response->assertNotFound();
});

test('criar orcamento sem categoryId retorna erro de validacao', function () {
    $response = $this->postJson('/api/budgets', [
        'monthYear'   => '2026-04',
        'limitAmount' => 800.00,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['categoryId']);
});

test('criar orcamento com limite negativo retorna erro de validacao', function () {
    $response = $this->postJson('/api/budgets', [
        'categoryId'  => $this->category->id,
        'monthYear'   => '2026-04',
        'limitAmount' => -100.00,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['limitAmount']);
});

test('nao permite criar orcamento duplicado para mesma categoria e mes', function () {
    Budget::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'categoryId' => $this->category->id, 'monthYear' => '2026-04',
        'limitAmount' => 800.00, 'spentAmount' => 0.0,
    ]);

    $response = $this->postJson('/api/budgets', [
        'categoryId'  => $this->category->id,
        'monthYear'   => '2026-04',
        'limitAmount' => 900.00,
    ]);

    $response->assertUnprocessable()
        ->assertJsonFragment(['message' => 'Já existe um orçamento para essa categoria neste mês.']);
});
