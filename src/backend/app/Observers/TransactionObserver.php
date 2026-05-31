<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\Budget;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        $this->updateRelatedBalances($transaction, $transaction->amount);
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        if ($transaction->isDirty('amount') || $transaction->isDirty('type') || $transaction->isDirty('accountId') || $transaction->isDirty('categoryId')) {
            // Re-calculating correctly would require the originals.
            // For simplicity in Stage 2, we subtract old and add new.
            $oldAmount = $transaction->getOriginal('amount');
            $oldType = $transaction->getOriginal('type');
            $oldAccountId = $transaction->getOriginal('accountId');
            
            // Revert old
            $this->revertBalance($oldAccountId, $oldType, $oldAmount, $transaction->getOriginal('categoryId'), $transaction->getOriginal('date'));
            
            // Apply new
            $this->updateRelatedBalances($transaction, $transaction->amount);
        }
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        $this->revertBalance($transaction->accountId, $transaction->type, $transaction->amount, $transaction->categoryId, $transaction->date);

        if ($transaction->attachmentUrl) {
            $urlPath = parse_url($transaction->attachmentUrl, PHP_URL_PATH);
            $relativePath = preg_replace('#^/storage/#', '', $urlPath);
            Storage::disk('public')->delete($relativePath);
        }
    }

    protected function updateRelatedBalances(Transaction $transaction, $amount): void
    {
        $account = Account::find($transaction->accountId);
        if ($account) {
            if ($transaction->type === 'income') {
                $account->increment('balance', $amount);
            } else {
                $account->decrement('balance', $amount);
                
                // Update Budget
                $monthYear = Carbon::parse($transaction->date)->format('Y-m');
                Budget::where('familyId', $transaction->familyId)
                    ->where('categoryId', $transaction->categoryId)
                    ->where('monthYear', $monthYear)
                    ->increment('spentAmount', $amount);
            }
        }
    }

    protected function revertBalance($accountId, $type, $amount, $categoryId, $date): void
    {
        $account = Account::find($accountId);
        if ($account) {
            if ($type === 'income') {
                $account->decrement('balance', $amount);
            } else {
                $account->increment('balance', $amount);
                
                // Revert Budget
                $monthYear = Carbon::parse($date)->format('Y-m');
                Budget::where('categoryId', $categoryId)
                    ->where('monthYear', $monthYear)
                    ->decrement('spentAmount', $amount);
            }
        }
    }
}
