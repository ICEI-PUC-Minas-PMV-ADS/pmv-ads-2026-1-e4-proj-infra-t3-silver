<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use MongoDB\BSON\ObjectId;
use MongoDB\Laravel\Query\Builder as MongoQueryBuilder;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $connection = 'mongodb';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot(): void
    {
        parent::boot();

        // Pre-generate ObjectId before insert: $incrementing=false makes Eloquent call
        // query->insert() (no return value) instead of insertGetId(), so we generate
        // the _id ourselves and expose it as 'id' for Sanctum's token string builder.
        static::creating(function ($model) {
            $model->attributes['_id'] = new ObjectId();
        });

        static::created(function ($model) {
            $model->attributes['id'] = (string) $model->attributes['_id'];
        });
    }

    public static function findToken($token)
    {
        if (strpos($token, '|') === false) {
            return static::where('token', hash('sha256', $token))->first();
        }

        [$id, $rawToken] = explode('|', $token, 2);

        $instance = static::where('_id', $id)->first();

        if ($instance) {
            return hash_equals($instance->token, hash('sha256', $rawToken)) ? $instance : null;
        }

        return null;
    }

    protected function newBaseQueryBuilder(): MongoQueryBuilder
    {
        $conn = $this->getConnection();

        return new MongoQueryBuilder(
            $conn,
            $conn->getQueryGrammar(),
            $conn->getPostProcessor(),
        );
    }
}
