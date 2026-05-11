<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Transaction;
$user = App\Models\User::first();
$t = Transaction::where('familyId', $user->familyId)->where('type', 'income')->sum('amount');
echo "SUM IS: " . var_export($t, true) . "\n";
