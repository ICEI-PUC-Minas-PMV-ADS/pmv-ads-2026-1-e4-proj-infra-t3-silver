<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    public function index(): JsonResponse
    {
        $goals = Goal::where('userId', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($goals);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:120'],
            'description'    => ['nullable', 'string', 'max:500'],
            'target_amount'  => ['required', 'numeric', 'min:0.01'],
            'current_amount' => ['nullable', 'numeric', 'min:0'],
            'deadline'       => ['nullable', 'date'],
            'status'         => ['nullable', 'string', 'in:ativa,concluida,cancelada'],
        ]);

        $goal = Goal::create([
            'userId'         => Auth::id(),
            'title'          => $validated['title'],
            'description'    => $validated['description'] ?? null,
            'target_amount'  => (float) $validated['target_amount'],
            'current_amount' => isset($validated['current_amount']) ? (float) $validated['current_amount'] : 0.0,
            'deadline'       => $validated['deadline'] ?? null,
            'status'         => $validated['status'] ?? 'ativa',
        ]);

        return response()->json($goal, 201);
    }

    public function show(string $id): JsonResponse
    {
        $goal = Goal::where('_id', $id)
            ->where('userId', Auth::id())
            ->firstOrFail();

        return response()->json($goal);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $goal = Goal::where('_id', $id)
            ->where('userId', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'title'          => ['sometimes', 'required', 'string', 'max:120'],
            'description'    => ['nullable', 'string', 'max:500'],
            'target_amount'  => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'current_amount' => ['nullable', 'numeric', 'min:0'],
            'deadline'       => ['nullable', 'date'],
            'status'         => ['nullable', 'string', 'in:ativa,concluida,cancelada'],
        ]);

        if (isset($validated['target_amount'])) {
            $validated['target_amount'] = (float) $validated['target_amount'];
        }

        if (isset($validated['current_amount'])) {
            $validated['current_amount'] = (float) $validated['current_amount'];
        }

        $goal->update($validated);

        return response()->json($goal->fresh());
    }

    public function destroy(string $id): JsonResponse
    {
        $goal = Goal::where('_id', $id)
            ->where('userId', Auth::id())
            ->firstOrFail();

        $goal->delete();

        return response()->json(['message' => 'Meta excluída com sucesso.']);
    }
}
