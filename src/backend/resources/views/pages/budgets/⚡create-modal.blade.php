<?php

use App\Models\Budget;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Attributes\On;
use Livewire\Component;

new class extends Component
{
    public string $categoryId = '';
    public string $monthYear = '';
    public string $limitAmount = '';

    #[On('init-create-budget')]
    public function initMonth(string $month): void
    {
        $this->monthYear = $month;
        $this->reset(['categoryId', 'limitAmount']);
        $this->resetErrorBag();
    }

    #[Computed]
    public function categories()
    {
        return Category::where('familyId', Auth::user()->familyId)
            ->orderBy('name')
            ->get();
    }

    public function save(): void
    {
        $validated = $this->validate([
            'categoryId'  => ['required', 'string'],
            'monthYear'   => ['required', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'limitAmount' => ['required', 'numeric', 'min:0.01'],
        ], [
            'categoryId.required'  => 'Selecione uma categoria.',
            'monthYear.required'   => 'Selecione o mês.',
            'limitAmount.required' => 'Informe o valor limite.',
            'limitAmount.numeric'  => 'O valor deve ser numérico.',
            'limitAmount.min'      => 'O limite deve ser maior que zero.',
        ]);

        $user = Auth::user();

        $exists = Budget::where('familyId', $user->familyId)
            ->where('categoryId', $validated['categoryId'])
            ->where('monthYear', $validated['monthYear'])
            ->exists();

        if ($exists) {
            $this->addError('categoryId', 'Já existe um orçamento para essa categoria neste mês.');
            return;
        }

        Budget::create([
            'familyId'    => $user->familyId,
            'userId'      => $user->id,
            'categoryId'  => $validated['categoryId'],
            'monthYear'   => $validated['monthYear'],
            'limitAmount' => (float) $validated['limitAmount'],
            'spentAmount' => 0.0,
        ]);

        $this->reset(['categoryId', 'limitAmount']);
        $this->monthYear = now()->format('Y-m');
        $this->resetErrorBag();

        $this->dispatch('budget-saved');
        $this->dispatch('flux:modal:close', name: 'create-budget');
    }
}; ?>

<flux:modal name="create-budget" class="max-w-lg" focusable>
    <div class="space-y-6">
        <div>
            <flux:heading size="lg">{{ __('Novo orçamento') }}</flux:heading>
            <flux:subheading>{{ __('Defina um limite de gastos para uma categoria no mês.') }}</flux:subheading>
        </div>

        <form wire:submit="save" class="space-y-4">

            <div class="space-y-1">
                <flux:label>{{ __('Categoria') }}</flux:label>
                <select
                    wire:model="categoryId"
                    class="block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-zinc-800 dark:text-white"
                >
                    <option value="">{{ __('Selecione uma categoria') }}</option>
                    @foreach ($this->categories as $category)
                        <option value="{{ $category->_id }}">{{ $category->name }}</option>
                    @endforeach
                </select>
                @error('categoryId')
                    <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                @enderror
                @if ($this->categories->isEmpty())
                    <p class="text-sm text-neutral-500">
                        {{ __('Nenhuma categoria cadastrada. Crie categorias primeiro.') }}
                    </p>
                @endif
            </div>

            <div class="space-y-1">
                <flux:input
                    wire:model="monthYear"
                    type="month"
                    :label="__('Mês de referência')"
                />
                @error('monthYear')
                    <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <div class="space-y-1">
                <flux:input
                    wire:model="limitAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    :label="__('Valor limite (R$)')"
                    placeholder="0,00"
                />
                @error('limitAmount')
                    <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <div class="flex justify-end gap-3 pt-2">
                <flux:modal.close>
                    <flux:button type="button" variant="ghost">{{ __('Cancelar') }}</flux:button>
                </flux:modal.close>
                <flux:button type="submit" variant="primary">
                    {{ __('Criar orçamento') }}
                </flux:button>
            </div>
        </form>
    </div>
</flux:modal>
