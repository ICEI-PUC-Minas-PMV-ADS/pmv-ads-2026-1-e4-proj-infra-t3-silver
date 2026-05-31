<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Budget extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'budgets';

    protected $fillable = [
        'familyId',
        'userId',
        'categoryId',
        'monthYear',
        'limitAmount',
        'spentAmount',
    ];

    protected $casts = [
        'limitAmount' => 'float',
        'spentAmount' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId', '_id');
    }

    public function family()
    {
        return $this->belongsTo(Family::class, 'familyId', '_id');
    }
}
