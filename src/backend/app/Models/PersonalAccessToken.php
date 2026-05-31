<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    // Retorna a connection padrão configurada (sqlite local, pgsql em produção)
    // evitando que newRelatedInstance() herde a connection MongoDB do User pai
    public function getConnectionName(): string
    {
        return config('database.default');
    }
}
