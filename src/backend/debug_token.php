<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$tokens = Illuminate\Support\Facades\DB::connection('mongodb')->table('personal_access_tokens')->get();
echo 'Token count: ' . count($tokens) . PHP_EOL;

if (count($tokens) > 0) {
    $t = $tokens[0];
    $data = (array) $t;
    echo 'Keys: ' . implode(', ', array_keys($data)) . PHP_EOL;
    foreach ($data as $k => $v) {
        $val = is_object($v) ? get_class($v).'::'.(string)$v : json_encode($v);
        echo "  $k => $val" . PHP_EOL;
    }

    // Test findToken lookup
    $idVal = $data['id'] ?? null;
    $idStr = is_object($idVal) ? (string)$idVal : (string)$idVal;
    echo PHP_EOL . 'Testing lookup by _id=' . $idStr . PHP_EOL;
    $found = App\Models\PersonalAccessToken::where('_id', $idStr)->first();
    echo 'where(_id): ' . ($found ? 'FOUND, key=' . $found->getKey() : 'NOT FOUND') . PHP_EOL;
}
