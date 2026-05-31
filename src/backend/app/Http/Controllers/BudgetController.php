<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Budget::where('familyId', $user->familyId);

        if ($request->has('monthYear')) {
            $query->where('monthYear', $request->monthYear);
        }

        $budgets = $query->orderBy('monthYear', 'desc')->get();

        return response()->json($budgets);
    }

    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'categoryId' => ['required', 'string'],
            'monthYear'  => ['required', 'string', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'limitAmount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $already = Budget::where('familyId', $user->familyId)
            ->where('categoryId', $validated['categoryId'])
            ->where('monthYear', $validated['monthYear'])
            ->exists();

        if ($already) {
            return response()->json([
                'message' => 'Já existe um orçamento para essa categoria neste mês.',
            ], 422);
        }

        $budget = Budget::create([
            'familyId'    => $user->familyId,
            'userId'      => $user->id,
            'categoryId'  => $validated['categoryId'],
            'monthYear'   => $validated['monthYear'],
            'limitAmount' => $validated['limitAmount'],
            'spentAmount' => 0.0,
        ]);

        return response()->json($budget, 201);
    }

    public function show(string $id): JsonResponse
    {
        $user = Auth::user();
        $budget = Budget::where('familyId', $user->familyId)->findOrFail($id);

        return response()->json($budget);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();
        $budget = Budget::where('familyId', $user->familyId)->findOrFail($id);

        $validated = $request->validate([
            'limitAmount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $budget->update(['limitAmount' => $validated['limitAmount']]);

        return response()->json($budget);
    }

    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();
        $budget = Budget::where('familyId', $user->familyId)->findOrFail($id);

        $budget->delete();

        return response()->json(['message' => 'Orçamento removido com sucesso.']);
    }
}
