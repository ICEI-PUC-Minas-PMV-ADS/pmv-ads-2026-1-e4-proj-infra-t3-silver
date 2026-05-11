<?php

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Title;
use Livewire\Component;
use Carbon\Carbon;

new #[Title('Painel')] class extends Component {
    
    #[Computed]
    public function currentBalance()
    {
        $user = Auth::user();
        if (!$user->familyId) return 0;

        $incomes = Transaction::where('familyId', $user->familyId)
            ->where('type', 'income')
            ->sum('amount');
            
        $expenses = Transaction::where('familyId', $user->familyId)
            ->where('type', 'expense')
            ->sum('amount');

        return $incomes - $expenses;
    }

    #[Computed]
    public function totalExpensesMonth()
    {
        $user = Auth::user();
        if (!$user->familyId) return 0;

        return Transaction::where('familyId', $user->familyId)
            ->where('type', 'expense')
            ->where('date', '>=', Carbon::now()->startOfMonth())
            ->sum('amount');
    }

    #[Computed]
    public function recentTransactions()
    {
        $user = Auth::user();
        if (!$user->familyId) return collect();

        return Transaction::where('familyId', $user->familyId)
            ->with(['category', 'account'])
            ->latest('date')
            ->take(5)
            ->get();
    }
}; ?>

<div class="flex h-full w-full flex-1 flex-col gap-6">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <!-- Saldo Atual -->
            <div class="relative overflow-hidden rounded-xl border border-neutral-200 p-6 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
                <flux:heading size="sm" class="text-neutral-500 uppercase tracking-wider">{{ __('Saldo Atual') }}</flux:heading>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-neutral-900 dark:text-white">
                        R$ {{ number_format($this->currentBalance, 2, ',', '.') }}
                    </span>
                </div>
                <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                    <flux:icon.trending-up class="mr-1 size-4" />
                    <span>{{ __('Saldo consolidado') }}</span>
                </div>
            </div>

            <!-- Despesas do Mês -->
            <div class="relative overflow-hidden rounded-xl border border-neutral-200 p-6 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
                <flux:heading size="sm" class="text-neutral-500 uppercase tracking-wider">{{ __('Despesas no Mes') }}</flux:heading>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-red-600 dark:text-red-400">
                        -R$ {{ number_format($this->totalExpensesMonth, 2, ',', '.') }}
                    </span>
                </div>
                <div class="mt-4 flex items-center text-sm text-neutral-500">
                    <flux:icon.calendar class="mr-1 size-4" />
                    <span>{{ Carbon::now()->translatedFormat('F Y') }}</span>
                </div>
            </div>

            <!-- Atalho Rapido -->
            <div class="relative overflow-hidden rounded-xl border border-neutral-200 p-6 dark:border-neutral-700 bg-neutral-900 text-white shadow-sm">
                <flux:heading size="sm" class="text-neutral-400 uppercase tracking-wider">{{ __('Acoes Rapidas') }}</flux:heading>
                <div class="mt-4 grid grid-cols-2 gap-2">
                    <flux:button variant="primary" class="w-full bg-brand hover:bg-brand-deep border-none">
                        <flux:icon.plus class="mr-2 size-4" />
                        {{ __('Receita') }}
                    </flux:button>
                    <flux:button variant="danger" class="w-full">
                        <flux:icon.minus class="mr-2 size-4" />
                        {{ __('Despesa') }}
                    </flux:button>
                </div>
            </div>
        </div>

        <!-- Transacoes Recentes -->
        <div class="relative flex-1 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
            <div class="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <flux:heading size="lg">{{ __('Transacoes Recentes') }}</flux:heading>
                <flux:link href="#" class="text-sm">{{ __('Ver todas') }}</flux:link>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 text-xs uppercase">
                        <tr>
                            <th class="px-6 py-3 font-medium">{{ __('Descricao') }}</th>
                            <th class="px-6 py-3 font-medium">{{ __('Categoria') }}</th>
                            <th class="px-6 py-3 font-medium">{{ __('Data') }}</th>
                            <th class="px-6 py-3 font-medium text-right">{{ __('Valor') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
                        @forelse($this->recentTransactions as $transaction)
                            <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-neutral-900 dark:text-white">{{ $transaction->description }}</div>
                                    <div class="text-xs text-neutral-500">{{ $transaction->account->name ?? 'Conta principal' }}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <flux:badge :color="$transaction->category->color ?? 'zinc'" size="sm">
                                        {{ $transaction->category->name ?? __('Sem categoria') }}
                                    </flux:badge>
                                </td>
                                <td class="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                    {{ $transaction->date->format('d/m/Y') }}
                                </td>
                                <td class="px-6 py-4 text-right font-semibold {{ $transaction->type === 'income' ? 'text-green-600' : 'text-red-600' }}">
                                    {{ $transaction->type === 'income' ? '+' : '-' }} R$ {{ number_format($transaction->amount, 2, ',', '.') }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-12 text-center text-neutral-500">
                                    <flux:icon.banknote class="mx-auto size-12 opacity-20 mb-4" />
                                    {{ __('Nenhuma transacao encontrada.') }}
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
