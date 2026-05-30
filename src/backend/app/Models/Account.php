<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Account extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'accounts';

    protected $fillable = [
        'familyId',
        'name',
        'type',
        'balance',
    ];

    public function family()
    {
        return $this->belongsTo(Family::class, 'familyId', '_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'accountId', '_id');
    }
}
