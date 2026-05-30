<?php

use App\Models\Budget;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Layout;
use Livewire\Attributes\On;
use Livewire\Attributes\Title;
use Livewire\Component;

new #[Title('Orçamentos')] #[Layout('layouts::app')] class extends Component
{
    public string $filterMonth = '';

    public function mount(): void
    {
        $this->filterMonth = now()->format('Y-m');
    }

    #[Computed]
    public function budgets()
    {
        return Budget::where('familyId', Auth::user()->familyId)
            ->where('monthYear', $this->filterMonth)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Budget $budget) {
                $category = Category::find($budget->categoryId);
                $budget->categoryName = $category?->name ?? 'Sem categoria';
                $budget->categoryColor = $category?->color ?? '#6b7280';
                $budget->percentage = $budget->limitAmount > 0
                    ? min(100, round(($budget->spentAmount / $budget->limitAmount) * 100))
                    : 0;
                $budget->remaining = max(0.0, $budget->limitAmount - $budget->spentAmount);

                return $budget;
            });
    }

    #[Computed]
    public function monthLabel(): string
    {
        return ucfirst(
            Carbon::createFromFormat('Y-m', $this->filterMonth)
                ->locale('pt_BR')
                ->isoFormat('MMMM [de] YYYY')
        );
    }

    #[Computed]
    public function totals(): array
    {
        $budgets = $this->budgets;
        $limit   = $budgets->sum('limitAmount');
        $spent   = $budgets->sum('spentAmount');

        return [
            'limit'      => $limit,
            'spent'      => $spent,
            'remaining'  => max(0.0, $limit - $spent),
            'percentage' => $limit > 0 ? min(100, round(($spent / $limit) * 100)) : 0,
        ];
    }

    public function previousMonth(): void
    {
        $this->filterMonth = Carbon::createFromFormat('Y-m', $this->filterMonth)
            ->subMonth()
            ->format('Y-m');

        unset($this->budgets, $this->totals, $this->monthLabel);
    }

    public function nextMonth(): void
    {
        $this->filterMonth = Carbon::createFromFormat('Y-m', $this->filterMonth)
            ->addMonth()
            ->format('Y-m');

        unset($this->budgets, $this->totals, $this->monthLabel);
    }

    #[On('budget-saved')]
    #[On('budget-deleted')]
    public function refresh(): void
    {
        unset($this->budgets, $this->totals);
    }
}; ?>

<div class="flex h-full w-full flex-1 flex-col gap-6 p-6">

    {{-- Cabeçalho --}}
    <div class="flex items-center justify-between">
        <div>
            <flux:heading size="xl" level="1">{{ __('Orçamentos') }}</flux:heading>
            <flux:subheading>{{ __('Gerencie seus limites mensais por categoria') }}</flux:subheading>
        </div>
        <flux:modal.trigger name="create-budget">
            <flux:button
                variant="primary"
                icon="plus"
                x-on:click="$dispatch('init-create-budget', { month: '{{ $filterMonth }}' })"
            >
                {{ __('Novo orçamento') }}
            </flux:button>
        </flux:modal.trigger>
    </div>

    {{-- Navegação de mês --}}
    <div class="flex items-center justify-center gap-4">
        <flux:button variant="ghost" icon="chevron-left" wire:click="previousMonth" />
        <flux:heading size="lg" class="min-w-52 text-center capitalize">
            {{ $this->monthLabel }}
        </flux:heading>
        <flux:button variant="ghost" icon="chevron-right" wire:click="nextMonth" />
    </div>

    {{-- Cards de resumo --}}
    <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
            <flux:text class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {{ __('Total orçado') }}
            </flux:text>
            <p class="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
                R$ {{ number_format($this->totals['limit'], 2, ',', '.') }}
            </p>
        </div>

        <div class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
            <flux:text class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {{ __('Total gasto') }}
            </flux:text>
            <p class="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">
                R$ {{ number_format($this->totals['spent'], 2, ',', '.') }}
            </p>
        </div>

        <div class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
            <flux:text class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {{ __('Disponível') }}
            </flux:text>
            <p class="mt-1 text-2xl font-semibold {{ $this->totals['remaining'] > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }}">
                R$ {{ number_format($this->totals['remaining'], 2, ',', '.') }}
            </p>
            @if ($this->totals['limit'] > 0)
                <p class="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                    {{ $this->totals['percentage'] }}% do orçamento utilizado
                </p>
            @endif
        </div>
    </div>

    {{-- Lista de orçamentos --}}
    @if ($this->budgets->isEmpty())
        <div class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
            <div class="rounded-full bg-neutral-100 p-4 dark:bg-zinc-800">
                <flux:icon name="wallet" class="size-8 text-neutral-400" />
            </div>
            <flux:heading>{{ __('Nenhum orçamento para este mês') }}</flux:heading>
            <flux:subheading class="text-center">
                {{ __('Crie um orçamento para acompanhar seus gastos por categoria.') }}
            </flux:subheading>
            <flux:modal.trigger name="create-budget">
                <flux:button
                    variant="primary"
                    icon="plus"
                    class="mt-2"
                    x-on:click="$dispatch('init-create-budget', { month: '{{ $filterMonth }}' })"
                >
                    {{ __('Criar orçamento') }}
                </flux:button>
            </flux:modal.trigger>
        </div>
    @else
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            @foreach ($this->budgets as $budget)
                @php
                    $progressColor = match (true) {
                        $budget->percentage >= 100 => 'bg-red-500',
                        $budget->percentage >= 85  => 'bg-orange-400',
                        $budget->percentage >= 60  => 'bg-yellow-400',
                        default                    => 'bg-green-500',
                    };
                    $textColor = match (true) {
                        $budget->percentage >= 100 => 'text-red-600 dark:text-red-400',
                        $budget->percentage >= 85  => 'text-orange-500 dark:text-orange-400',
                        $budget->percentage >= 60  => 'text-yellow-600 dark:text-yellow-400',
                        default                    => 'text-green-600 dark:text-green-400',
                    };
                @endphp

                <div class="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">

                    <div class="flex items-start justify-between gap-2">
                        <div class="flex min-w-0 items-center gap-3">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                                style="background-color: {{ $budget->categoryColor }}"
                            >
                                {{ mb_strtoupper(mb_substr($budget->categoryName, 0, 2)) }}
                            </div>
                            <div class="min-w-0">
                                <p class="truncate font-semibold text-neutral-900 dark:text-white">
                                    {{ $budget->categoryName }}
                                </p>
                                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                                    {{ $budget->monthYear }}
                                </p>
                            </div>
                        </div>

                        <div class="flex shrink-0 gap-1">
                            <flux:button
                                size="sm"
                                variant="ghost"
                                icon="pencil"
                                x-on:click="
                                    $dispatch('open-edit-budget', {
                                        id: '{{ $budget->_id }}',
                                        limitAmount: '{{ $budget->limitAmount }}'
                                    });
                                    $flux.modal('edit-budget').show();
                                "
                            />
                            <flux:button
                                size="sm"
                                variant="ghost"
                                icon="trash"
                                class="!text-red-500 hover:!text-red-600 dark:!text-red-400"
                                x-on:click="
                                    $dispatch('open-delete-budget', {
                                        id: '{{ $budget->_id }}',
                                        name: '{{ addslashes($budget->categoryName) }}'
                                    });
                                    $flux.modal('delete-budget').show();
                                "
                            />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-baseline justify-between text-sm">
                            <span class="text-neutral-500 dark:text-neutral-400">
                                R$ {{ number_format($budget->spentAmount, 2, ',', '.') }}
                                <span class="text-xs text-neutral-400 dark:text-neutral-500">
                                    de R$ {{ number_format($budget->limitAmount, 2, ',', '.') }}
                                </span>
                            </span>
                            <span class="font-semibold {{ $textColor }}">
                                {{ $budget->percentage }}%
                            </span>
                        </div>

                        <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-zinc-700">
                            <div
                                class="h-2 rounded-full transition-all duration-300 {{ $progressColor }}"
                                style="width: {{ $budget->percentage }}%"
                            ></div>
                        </div>

                        <p class="text-xs {{ $textColor }}">
                            @if ($budget->percentage >= 100)
                                Limite excedido
                            @else
                                R$ {{ number_format($budget->remaining, 2, ',', '.') }} disponível
                            @endif
                        </p>
                    </div>
                </div>
            @endforeach
        </div>
    @endif

    {{-- Modais como componentes separados --}}
    <livewire:pages::budgets.create-modal />
    <livewire:pages::budgets.edit-modal />
    <livewire:pages::budgets.delete-modal />

</div>
