<?php

use App\Models\Account;
use App\Models\Budget;
use App\Models\Category;
use App\Models\Family;
use App\Models\Goal;
use App\Models\Transaction;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
    $this->conta = Account::create([
        'familyId' => $this->family->id, 'name' => 'CC',
        'type' => 'checking', 'balance' => 5000,
    ]);
    $this->categoria = Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Alimentação', 'color' => '#FF6B6B', 'icon' => 'utensils',
    ]);
    Sanctum::actingAs($this->user);
});

test('RF02 - dashboard mostra resumo de contas', function () {
    $response = $this->getJson('/api/accounts');

    $response->assertOk();
    $accounts = $response->json();
    $saldoTotal = array_sum(array_column($accounts, 'balance'));

    expect($saldoTotal)->toEqual(5000.0);
});

test('RF02 - dashboard mostra resumo de transacoes recentes', function () {
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->conta->id, 'categoryId' => $this->categoria->id,
        'type' => 'income', 'amount' => 3000.0, 'description' => 'Salário',
        'date' => now(), 'source' => 'web',
    ]);
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->conta->id, 'categoryId' => $this->categoria->id,
        'type' => 'expense', 'amount' => 200.0, 'description' => 'Mercado',
        'date' => now(), 'source' => 'web',
    ]);

    $response = $this->getJson('/api/transactions');

    $response->assertOk();
    $data = $response->json('data') ?? $response->json();
    expect($data)->toHaveCount(2);
});

test('RF02 - dashboard mostra total de receitas vs despesas', function () {
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->conta->id, 'categoryId' => $this->categoria->id,
        'type' => 'income', 'amount' => 5000.0, 'description' => 'Salário',
        'date' => now(), 'source' => 'web',
    ]);
    Transaction::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'accountId' => $this->conta->id, 'categoryId' => $this->categoria->id,
        'type' => 'expense', 'amount' => 1500.0, 'description' => 'Aluguel',
        'date' => now(), 'source' => 'web',
    ]);

    $transactions = Transaction::where('familyId', $this->family->id)->get();
    $receitas = $transactions->where('type', 'income')->sum('amount');
    $despesas = $transactions->where('type', 'expense')->sum('amount');
    $saldo = $receitas - $despesas;

    expect($receitas)->toEqual(5000.0);
    expect($despesas)->toEqual(1500.0);
    expect($saldo)->toEqual(3500.0);
});

test('RF02 - dashboard mostra metas ativas', function () {
    Goal::create([
        'userId' => $this->user->id, 'title' => 'Meta Ativa',
        'target_amount' => 10000.0, 'current_amount' => 2000.0,
        'status' => 'ativa',
    ]);

    $response = $this->getJson('/api/goals');

    $response->assertOk()->assertJsonCount(1);
});

test('RF02 - dashboard mostra orcamentos do mes', function () {
    Budget::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'categoryId' => $this->categoria->id, 'monthYear' => now()->format('Y-m'),
        'limitAmount' => 1000.0, 'spentAmount' => 0.0,
    ]);

    $response = $this->getJson('/api/budgets');

    $response->assertOk()->assertJsonCount(1);
});
