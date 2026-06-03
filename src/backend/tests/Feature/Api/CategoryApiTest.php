<?php

use App\Models\Budget;
use App\Models\Category;
use App\Models\Family;
use App\Models\Transaction;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
    $this->defaultCategory = Category::create([
        'familyId' => $this->family->id,
        'userId' => $this->user->id,
        'name' => 'Sem Categoria',
        'color' => '#9E9E9E',
        'icon' => 'tag',
        'is_default' => true,
    ]);
    Sanctum::actingAs($this->user);
});

test('RF04 - usuario pode listar categorias', function () {
    Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Alimentação', 'color' => '#FF6B6B', 'icon' => 'utensils',
    ]);

    $response = $this->getJson('/api/categorias');

    $response->assertOk();
    expect($response->json())->toHaveCount(2);
});

test('RF04 - usuario pode criar categoria', function () {
    $response = $this->postJson('/api/categorias', [
        'name' => 'Transporte',
        'color' => '#4ECDC4',
        'icon' => 'car',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['name' => 'Transporte']);
});

test('RF04 - categoria criada nao e default', function () {
    $response = $this->postJson('/api/categorias', [
        'name' => 'Lazer',
        'color' => '#DDA0DD',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['is_default' => false]);
});

test('RF04 - usuario pode ver categoria pelo id', function () {
    $category = Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Saúde', 'color' => '#96CEB4', 'icon' => 'heart-pulse',
    ]);

    $response = $this->getJson("/api/categorias/{$category->id}");

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Saúde']);
});

test('RF04 - usuario pode atualizar categoria', function () {
    $category = Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Antigo', 'color' => '#000', 'icon' => 'tag',
    ]);

    $response = $this->putJson("/api/categorias/{$category->id}", [
        'name' => 'Renomeado',
        'color' => '#FF0000',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Renomeado']);
});

test('RF04 - usuario pode deletar categoria', function () {
    $category = Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Temporária', 'color' => '#AAA', 'icon' => 'x',
    ]);

    $response = $this->deleteJson("/api/categorias/{$category->id}");

    $response->assertOk();
    expect(Category::find($category->id))->toBeNull();
});

test('RF04 - nao permite deletar categoria default', function () {
    $response = $this->deleteJson("/api/categorias/{$this->defaultCategory->id}");

    $response->assertUnprocessable()
        ->assertJsonFragment(['message' => 'A categoria padrão não pode ser removida.']);
});

test('RF04 - criar categoria com nome duplicado retorna erro', function () {
    Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Moradia', 'color' => '#45B7D1', 'icon' => 'home',
    ]);

    $this->postJson('/api/categorias', [
        'name' => 'Moradia',
        'color' => '#000',
    ])->assertUnprocessable();
});

test('RF04 - deletar categoria move transacoes para fallback', function () {
    $account = \App\Models\Account::create([
        'familyId' => $this->family->id, 'name' => 'CC',
        'type' => 'checking', 'balance' => 1000,
    ]);
    $category = Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Removível', 'color' => '#BBB', 'icon' => 'x',
    ]);
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $account->id, 'categoryId' => $category->id,
        'type' => 'expense', 'amount' => 50, 'description' => 'Teste',
        'date' => now(), 'source' => 'web',
    ]);

    $this->deleteJson("/api/categorias/{$category->id}")->assertOk();

    $transaction = Transaction::where('familyId', $this->family->id)->first();
    expect($transaction->categoryId)->toBe($this->defaultCategory->id);
});

test('RF14 - categorias listadas com ordenacao correta (default primeiro)', function () {
    Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'ZZZ', 'color' => '#000', 'icon' => 'x',
    ]);

    $response = $this->getJson('/api/categorias');
    $data = $response->json();

    expect($data[0]['is_default'])->toBeTrue();
});
