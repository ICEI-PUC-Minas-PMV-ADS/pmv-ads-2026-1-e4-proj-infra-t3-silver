<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('dashboard', 'dashboard')->name('dashboard');
    Route::livewire('budgets', 'pages::budgets')->name('budgets.index');
    Route::livewire('transactions', 'pages::transactions')->name('transactions.index');
});

require __DIR__.'/settings.php';
