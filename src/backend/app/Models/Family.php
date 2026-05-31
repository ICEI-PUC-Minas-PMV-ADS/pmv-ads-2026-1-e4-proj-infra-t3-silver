<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Family extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'families';

    protected $fillable = [
        'name',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'familyId', '_id');
    }

    public function accounts()
    {
        return $this->hasMany(Account::class, 'familyId', '_id');
    }
}
