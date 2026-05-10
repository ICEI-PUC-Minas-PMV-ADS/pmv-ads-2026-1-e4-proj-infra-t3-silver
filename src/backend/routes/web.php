<?php

use App\Http\Controllers\GoalViewController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('dashboard', 'dashboard')->name('dashboard');

    Route::resource('goals', GoalViewController::class);
});

require __DIR__.'/settings.php';