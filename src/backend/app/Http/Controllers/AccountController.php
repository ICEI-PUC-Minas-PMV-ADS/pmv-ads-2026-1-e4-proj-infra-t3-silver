<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    /**
     * Display a listing of the family's accounts.
     */
    public function index()
    {
        $user = Auth::user();
        $accounts = Account::where('familyId', $user->familyId)->get();
        
        return response()->json($accounts);
    }

    /**
     * Store a newly created account.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:checking,savings,investment,cash',
            'balance' => 'required|numeric',
        ]);

        $account = Account::create([
            'familyId' => $user->familyId,
            'name' => $validated['name'],
            'type' => $validated['type'],
            'balance' => $validated['balance'],
        ]);

        return response()->json($account, 201);
    }

    /**
     * Show a specific account.
     */
    public function show($id)
    {
        $user = Auth::user();
        $account = Account::where('familyId', $user->familyId)->findOrFail($id);

        return response()->json($account);
    }

    /**
     * Update the specified account.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $account = Account::where('familyId', $user->familyId)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:checking,savings,investment,cash',
            'balance' => 'sometimes|numeric',
        ]);

        $account->update($validated);

        return response()->json($account);
    }

    /**
     * Remove the specified account.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $account = Account::where('familyId', $user->familyId)->findOrFail($id);
        $account->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}
