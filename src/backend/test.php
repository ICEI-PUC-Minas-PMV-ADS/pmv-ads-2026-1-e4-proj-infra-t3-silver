<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config(['database.connections.mongodb.dsn' => 'mongodb://127.0.0.1:27017']);

use App\Models\Transaction;
$t = Transaction::orderBy('created_at', 'desc')->first();
echo json_encode([
    'date' => $t ? $t->getRawOriginal('date') : null,
    'amount' => $t ? $t->getRawOriginal('amount') : null,
    'type' => $t ? $t->getRawOriginal('type') : null,
], JSON_PRETTY_PRINT) . "\n";
