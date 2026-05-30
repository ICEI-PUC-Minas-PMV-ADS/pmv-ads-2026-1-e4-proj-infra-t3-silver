<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    // is_default marca o fallback usado quando uma categoria é deletada
    private const DEFAULTS = [
        ['name' => 'Sem Categoria', 'color' => '#9E9E9E', 'icon' => 'tag',          'is_default' => true],
        ['name' => 'Alimentação',   'color' => '#FF6B6B', 'icon' => 'utensils',     'is_default' => false],
        ['name' => 'Transporte',    'color' => '#4ECDC4', 'icon' => 'car',          'is_default' => false],
        ['name' => 'Moradia',       'color' => '#45B7D1', 'icon' => 'home',         'is_default' => false],
        ['name' => 'Saúde',         'color' => '#96CEB4', 'icon' => 'heart-pulse',  'is_default' => false],
        ['name' => 'Educação',      'color' => '#FFEAA7', 'icon' => 'graduation-cap', 'is_default' => false],
        ['name' => 'Lazer',         'color' => '#DDA0DD', 'icon' => 'gamepad-2',    'is_default' => false],
        ['name' => 'Vestuário',     'color' => '#F0A500', 'icon' => 'shirt',        'is_default' => false],
        ['name' => 'Salário',       'color' => '#6BCB77', 'icon' => 'banknote',     'is_default' => false],
        ['name' => 'Outros',        'color' => '#B0BEC5', 'icon' => 'ellipsis',     'is_default' => false],
    ];

    public function createDefaultsForFamily(string $familyId, string $userId): void
    {
        $categories = array_map(fn($cat) => array_merge($cat, [
            'familyId' => $familyId,
            'userId'   => $userId,
        ]), self::DEFAULTS);

        Category::insert($categories);
    }

    public function findFallback(string $familyId): Category
    {
        return Category::where('familyId', $familyId)
            ->where('is_default', true)
            ->firstOrFail();
    }
}
