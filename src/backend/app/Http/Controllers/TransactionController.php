<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of the family's transactions.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Transaction::where('familyId', $user->familyId);

        if ($request->has('accountId')) {
            $query->where('accountId', $request->accountId);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $transactions = $query->latest('date')->paginate(20);
        
        return response()->json($transactions);
    }

    /**
     * Store a newly created transaction.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'accountId' => 'required|string',
            'categoryId' => 'required|string',
            'type' => 'required|string|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:500',
            'date' => 'nullable|date',
            'source' => 'nullable|string|in:web,mobile,whatsapp',
            'attachment' => 'nullable|image|max:5120',
        ]);

        // Ensure account belongs to user's family
        $account = Account::where('familyId', $user->familyId)->findOrFail($validated['accountId']);

        $attachmentUrl = null;
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('attachments', 'public');
            $attachmentUrl = Storage::disk('public')->url($path);
        }

        $transaction = Transaction::create([
            'familyId' => $user->familyId,
            'userId' => $user->id,
            'accountId' => $validated['accountId'],
            'categoryId' => $validated['categoryId'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'date' => $validated['date'] ?? now(),
            'source' => $validated['source'] ?? 'web',
            'attachmentUrl' => $attachmentUrl,
        ]);

        return response()->json($transaction, 201);
    }

    /**
     * Show a specific transaction.
     */
    public function show($id)
    {
        $user = Auth::user();
        $transaction = Transaction::where('familyId', $user->familyId)->findOrFail($id);

        return response()->json($transaction);
    }

    /**
     * Remove the specified transaction.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $transaction = Transaction::where('familyId', $user->familyId)->findOrFail($id);
        
        $transaction->delete();

        return response()->json(['message' => 'Transacao excluida com sucesso']);
    }
}
