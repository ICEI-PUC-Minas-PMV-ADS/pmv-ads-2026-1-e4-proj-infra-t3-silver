<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Family;
use App\Models\Transaction;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
    $this->account = Account::create([
        'familyId' => $this->family->id,
        'userId' => $this->user->id,
        'name' => 'Conta Corrente',
        'type' => 'checking',
        'balance' => 5000.00,
    ]);
    $this->category = Category::create([
        'familyId' => $this->family->id,
        'userId' => $this->user->id,
        'name' => 'Alimentação',
        'color' => '#FF6B6B',
        'icon' => 'utensils',
    ]);
    Sanctum::actingAs($this->user);
});

test('RF01 - usuario pode criar uma transacao (receita)', function () {
    $response = $this->postJson('/api/transactions', [
        'accountId' => $this->account->id,
        'categoryId' => $this->category->id,
        'type' => 'income',
        'amount' => 1500.00,
        'description' => 'Salário Janeiro',
        'date' => '2026-01-15',
        'source' => 'web',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['type' => 'income', 'amount' => 1500.0]);
});

test('RF01 - usuario pode criar uma transacao (despesa)', function () {
    $response = $this->postJson('/api/transactions', [
        'accountId' => $this->account->id,
        'categoryId' => $this->category->id,
        'type' => 'expense',
        'amount' => 89.90,
        'description' => 'Supermercado',
        'date' => '2026-01-20',
        'source' => 'web',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['type' => 'expense']);
});

test('RF01 - usuario pode listar transacoes', function () {
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->account->id, 'categoryId' => $this->category->id,
        'type' => 'income', 'amount' => 3000.0, 'description' => 'Freela',
        'date' => now(), 'source' => 'web',
    ]);

    $response = $this->getJson('/api/transactions');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

test('RF01 - usuario pode ver uma transacao pelo id', function () {
    $transaction = Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->account->id, 'categoryId' => $this->category->id,
        'type' => 'expense', 'amount' => 45.0, 'description' => 'Uber',
        'date' => now(), 'source' => 'web',
    ]);

    $response = $this->getJson("/api/transactions/{$transaction->id}");

    $response->assertOk()
        ->assertJsonFragment(['description' => 'Uber']);
});

test('RF01 - usuario pode deletar uma transacao', function () {
    $transaction = Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->account->id, 'categoryId' => $this->category->id,
        'type' => 'expense', 'amount' => 100.0, 'description' => 'Gasolina',
        'date' => now(), 'source' => 'web',
    ]);

    $response = $this->deleteJson("/api/transactions/{$transaction->id}");

    $response->assertOk();
    expect(Transaction::find($transaction->id))->toBeNull();
});

test('RF10 - usuario pode filtrar transacoes por tipo', function () {
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->account->id, 'categoryId' => $this->category->id,
        'type' => 'income', 'amount' => 2000.0, 'description' => 'Salário',
        'date' => now(), 'source' => 'web',
    ]);
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->account->id, 'categoryId' => $this->category->id,
        'type' => 'expense', 'amount' => 50.0, 'description' => 'Lanche',
        'date' => now(), 'source' => 'web',
    ]);

    $response = $this->getJson('/api/transactions?type=income');

    $response->assertOk();
    $data = $response->json('data') ?? $response->json();
    expect($data)->toHaveCount(1);
});

test('RF10 - usuario pode filtrar transacoes por conta', function () {
    $outraConta = Account::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Poupança', 'type' => 'savings', 'balance' => 10000.0,
    ]);

    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->account->id, 'categoryId' => $this->category->id,
        'type' => 'expense', 'amount' => 30.0, 'description' => 'CC despesa',
        'date' => now(), 'source' => 'web',
    ]);
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $outraConta->id, 'categoryId' => $this->category->id,
        'type' => 'income', 'amount' => 500.0, 'description' => 'Poup rendimento',
        'date' => now(), 'source' => 'web',
    ]);

    $response = $this->getJson('/api/transactions?accountId=' . $this->account->id);

    $response->assertOk();
    $data = $response->json('data') ?? $response->json();
    expect($data)->toHaveCount(1)
        ->and($data[0]['description'])->toBe('CC despesa');
});

test('RF01 - criar transacao com tipo invalido retorna erro', function () {
    $this->postJson('/api/transactions', [
        'accountId' => $this->account->id,
        'categoryId' => $this->category->id,
        'type' => 'invalid',
        'amount' => 100,
        'description' => 'Teste',
    ])->assertUnprocessable();
});

test('RF01 - criar transacao sem accountId retorna erro', function () {
    $this->postJson('/api/transactions', [
        'categoryId' => $this->category->id,
        'type' => 'expense',
        'amount' => 100,
        'description' => 'Teste',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['accountId']);
});

test('RF01 - usuario nao pode acessar transacao de outra familia', function () {
    $outraFamilia = Family::create(['name' => 'Outra']);
    $outraConta = Account::create([
        'familyId' => $outraFamilia->id, 'userId' => $this->user->id,
        'name' => 'Conta', 'type' => 'checking', 'balance' => 0,
    ]);
    $transacaoAlheia = Transaction::create([
        'familyId' => $outraFamilia->id, 'userId' => $this->user->id,
        'accountId' => $outraConta->id, 'categoryId' => $this->category->id,
        'type' => 'expense', 'amount' => 999, 'description' => 'Secreta',
        'date' => now(), 'source' => 'web',
    ]);

    $this->getJson("/api/transactions/{$transacaoAlheia->id}")->assertNotFound();
});
