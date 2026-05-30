<?php

use App\Http\Controllers\GoalViewController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return view('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::livewire('dashboard', 'pages::dashboard')->name('dashboard');
    Route::livewire('accounts', 'pages::accounts')->name('accounts.index');
    Route::livewire('budgets', 'pages::budgets')->name('budgets.index');
    Route::livewire('transactions', 'pages::transactions')->name('transactions.index');
    Route::resource('goals', GoalViewController::class);
});

require __DIR__.'/settings.php';