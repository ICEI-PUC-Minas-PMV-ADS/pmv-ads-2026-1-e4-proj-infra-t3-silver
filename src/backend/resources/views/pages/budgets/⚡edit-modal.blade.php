<?php

use App\Models\Budget;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On;
use Livewire\Component;

new class extends Component
{
    public string $editingId = '';
    public string $limitAmount = '';

    #[On('open-edit-budget')]
    public function load(string $id, string $limitAmount): void
    {
        $this->editingId = $id;
        $this->limitAmount = $limitAmount;
        $this->resetErrorBag();
    }

    public function save(): void
    {
        $validated = $this->validate([
            'limitAmount' => ['required', 'numeric', 'min:0.01'],
        ], [
            'limitAmount.required' => 'Informe o novo limite.',
            'limitAmount.numeric'  => 'O valor deve ser numérico.',
            'limitAmount.min'      => 'O limite deve ser maior que zero.',
        ]);

        Budget::where('familyId', Auth::user()->familyId)
            ->findOrFail($this->editingId)
            ->update(['limitAmount' => (float) $validated['limitAmount']]);

        $this->reset(['editingId', 'limitAmount']);
        $this->dispatch('budget-saved');
        $this->dispatch('flux:modal:close', name: 'edit-budget');
    }
}; ?>

<flux:modal name="edit-budget" class="max-w-sm" focusable>
    <div class="space-y-6">
        <div>
            <flux:heading size="lg">{{ __('Editar orçamento') }}</flux:heading>
            <flux:subheading>{{ __('Altere o valor limite do orçamento.') }}</flux:subheading>
        </div>

        <form wire:submit="save" class="space-y-4">
            <div class="space-y-1">
                <flux:input
                    wire:model="limitAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    :label="__('Novo valor limite (R$)')"
                    placeholder="0,00"
                    autofocus
                />
                @error('limitAmount')
                    <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <div class="flex justify-end gap-3 pt-2">
                <flux:modal.close>
                    <flux:button type="button" variant="ghost">{{ __('Cancelar') }}</flux:button>
                </flux:modal.close>
                <flux:button type="submit" variant="primary">{{ __('Salvar') }}</flux:button>
            </div>
        </form>
    </div>
</flux:modal>
