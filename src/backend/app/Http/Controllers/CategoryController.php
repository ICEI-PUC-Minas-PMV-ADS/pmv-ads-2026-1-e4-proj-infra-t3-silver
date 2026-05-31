<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $categoryService) {}

    public function index(): JsonResponse
    {
        $categories = Category::where('familyId', Auth::user()->familyId)
            ->orderBy('is_default', 'desc')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icon'  => ['nullable', 'string', 'max:50'],
        ]);

        $exists = Category::where('familyId', $user->familyId)
            ->whereRaw(['name' => ['$regex' => '^' . preg_quote($validated['name'], '/') . '$', '$options' => 'i']])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Já existe uma categoria com esse nome.'], 422);
        }

        $category = Category::create([
            'familyId'   => $user->familyId,
            'userId'     => $user->id,
            'name'       => $validated['name'],
            'color'      => $validated['color'] ?? '#9E9E9E',
            'icon'       => $validated['icon'] ?? 'tag',
            'is_default' => false,
        ]);

        return response()->json($category, 201);
    }

    public function show(string $id): JsonResponse
    {
        $category = Category::where('familyId', Auth::user()->familyId)
            ->findOrFail($id);

        return response()->json($category);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        $category = Category::where('familyId', $user->familyId)->findOrFail($id);

        $validated = $request->validate([
            'name'  => ['sometimes', 'required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icon'  => ['nullable', 'string', 'max:50'],
        ]);

        if (isset($validated['name'])) {
            $exists = Category::where('familyId', $user->familyId)
                ->where('_id', '!=', $id)
                ->whereRaw(['name' => ['$regex' => '^' . preg_quote($validated['name'], '/') . '$', '$options' => 'i']])
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Já existe uma categoria com esse nome.'], 422);
            }
        }

        $category->update($validated);

        return response()->json($category->fresh());
    }

    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();

        $category = Category::where('familyId', $user->familyId)->findOrFail($id);

        if ($category->is_default) {
            return response()->json(['message' => 'A categoria padrão não pode ser removida.'], 422);
        }

        $fallback = $this->categoryService->findFallback($user->familyId);

        $transactionCount = Transaction::where('familyId', $user->familyId)
            ->where('categoryId', $id)
            ->count();

        $budgetCount = Budget::where('familyId', $user->familyId)
            ->where('categoryId', $id)
            ->count();

        if ($transactionCount > 0) {
            Transaction::where('familyId', $user->familyId)
                ->where('categoryId', $id)
                ->update(['categoryId' => $fallback->id]);
        }

        if ($budgetCount > 0) {
            Budget::where('familyId', $user->familyId)
                ->where('categoryId', $id)
                ->update(['categoryId' => $fallback->id]);
        }

        $category->delete();

        return response()->json([
            'message' => "Categoria removida. {$transactionCount} transação(ões) e {$budgetCount} orçamento(s) movidos para 'Sem Categoria'.",
        ]);
    }
}
