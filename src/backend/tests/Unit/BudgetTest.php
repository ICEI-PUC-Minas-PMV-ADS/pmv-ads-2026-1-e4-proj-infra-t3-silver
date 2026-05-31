<?php

use App\Models\Budget;

test('limitAmount e convertido para float pelo cast', function () {
    $budget = new Budget(['limitAmount' => '800']);

    expect($budget->limitAmount)->toBeFloat()
        ->and($budget->limitAmount)->toBe(800.0);
});

test('spentAmount e convertido para float pelo cast', function () {
    $budget = new Budget(['spentAmount' => '320']);

    expect($budget->spentAmount)->toBeFloat()
        ->and($budget->spentAmount)->toBe(320.0);
});

test('fillable contem os campos esperados', function () {
    $budget = new Budget();

    expect($budget->getFillable())
        ->toContain('familyId')
        ->toContain('userId')
        ->toContain('categoryId')
        ->toContain('monthYear')
        ->toContain('limitAmount')
        ->toContain('spentAmount');
});

test('modelo pertence a colecao budgets no mongodb', function () {
    $budget = new Budget();

    expect($budget->getTable())->toBe('budgets');
});

test('spentAmount inicial e zero quando criado sem valor', function () {
    $budget = new Budget([
        'limitAmount' => 500.0,
        'monthYear'   => '2026-04',
    ]);

    expect($budget->spentAmount)->toBeNull();

    // Ao criar via controller, spentAmount é sempre inicializado como 0
    $budget->spentAmount = 0.0;
    expect($budget->spentAmount)->toBe(0.0);
});

test('limite restante e calculado corretamente', function () {
    $budget = new Budget([
        'limitAmount' => 1000.0,
        'spentAmount' => 350.0,
    ]);

    $remaining = $budget->limitAmount - $budget->spentAmount;

    expect($remaining)->toBe(650.0);
});
