<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class GoalViewController extends Controller
{
    public function index(): View
    {
        $goals = Goal::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return view('goals.index', compact('goals'));
    }

    public function create(): View
    {
        return view('goals.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'target_amount' => ['required', 'numeric', 'min:0.01'],
            'current_amount' => ['nullable', 'numeric', 'min:0'],
            'deadline' => ['nullable', 'date'],
            'status' => ['required', 'string'],
        ]);

        Goal::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'target_amount' => (float) $validated['target_amount'],
            'current_amount' => isset($validated['current_amount'])
                ? (float) $validated['current_amount']
                : 0,
            'deadline' => $validated['deadline'] ?? null,
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route('goals.index')
            ->with('success', 'Meta cadastrada com sucesso.');
    }

    public function show(string $goal): View
    {
        $goal = $this->findUserGoal($goal);

        return view('goals.show', compact('goal'));
    }

    public function edit(string $goal): View
    {
        $goal = $this->findUserGoal($goal);

        return view('goals.edit', compact('goal'));
    }

    public function update(Request $request, string $goal): RedirectResponse
    {
        $goal = $this->findUserGoal($goal);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'target_amount' => ['required', 'numeric', 'min:0.01'],
            'current_amount' => ['nullable', 'numeric', 'min:0'],
            'deadline' => ['nullable', 'date'],
            'status' => ['required', 'string'],
        ]);

        $goal->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'target_amount' => (float) $validated['target_amount'],
            'current_amount' => isset($validated['current_amount'])
                ? (float) $validated['current_amount']
                : 0,
            'deadline' => $validated['deadline'] ?? null,
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route('goals.index')
            ->with('success', 'Meta atualizada com sucesso.');
    }

    public function destroy(string $goal): RedirectResponse
    {
        $goal = $this->findUserGoal($goal);

        $goal->delete();

        return redirect()
            ->route('goals.index')
            ->with('success', 'Meta excluída com sucesso.');
    }

    private function findUserGoal(string $id): Goal
    {
        return Goal::where('_id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
    }
}