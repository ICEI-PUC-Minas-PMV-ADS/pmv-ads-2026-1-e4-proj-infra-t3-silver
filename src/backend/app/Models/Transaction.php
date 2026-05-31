<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Transaction extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'transactions';

    protected $fillable = [
        'familyId',
        'accountId',
        'userId',
        'categoryId',
        'type',
        'amount',
        'description',
        'source',
        'attachmentUrl',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
        'amount' => 'float',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'accountId', '_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId', '_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', '_id');
    }
}
