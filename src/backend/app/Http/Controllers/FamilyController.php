<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Budget;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FamilyController extends Controller
{
    /**
     * Display the current user's family and members.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user->familyId) {
            return response()->json(['message' => 'User not associated with any family.'], 404);
        }

        $family = Family::with('users:_id,name,email')->find($user->familyId);

        if (!$family) {
            return response()->json(['message' => 'Family not found.'], 404);
        }

        return response()->json($family);
    }

    /**
     * Update the family name.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $family = Family::findOrFail($user->familyId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $family->update(['name' => $validated['name']]);

        return response()->json($family);
    }

    /**
     * Join another family and merge history.
     */
    public function join(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'family_id' => 'required|string',
        ]);

        $newFamily = Family::findOrFail($validated['family_id']);
        $oldFamilyId = $user->familyId;

        if ($oldFamilyId === $newFamily->_id) {
            return response()->json(['message' => 'You are already in this family.'], 400);
        }

        // Merge de Histórico: Update familyId for all records belonging to the user's old family
        // This assumes the user was solo or is bringing all their family data with them.
        // According to documentation: "O sistema executa uma atualização em lote para trocar o familyId 
        // de todos os registros prévios do novo membro (Contas, Transações, Categorias, Metas) pelo ID da nova família."
        
        Account::where('familyId', $oldFamilyId)->update(['familyId' => $newFamily->_id]);
        Transaction::where('familyId', $oldFamilyId)->update(['familyId' => $newFamily->_id]);
        Category::where('familyId', $oldFamilyId)->update(['familyId' => $newFamily->_id]);
        Budget::where('familyId', $oldFamilyId)->update(['familyId' => $newFamily->_id]);
        
        // Update user's family association
        $user->update(['familyId' => $newFamily->_id]);

        // Delete old family if it becomes empty
        $remainingUsers = User::where('familyId', $oldFamilyId)->count();
        if ($remainingUsers === 0) {
            Family::destroy($oldFamilyId);
        }

        return response()->json([
            'message' => 'Joined family successfully and merged history.',
            'family' => Family::with('users:_id,name,email')->find($newFamily->_id),
        ]);
    }

    /**
     * List members of the family.
     */
    public function members()
    {
        $user = Auth::user();
        $users = User::where('familyId', $user->familyId)->get(['_id', 'name', 'email']);
        
        return response()->json($users);
    }
}
