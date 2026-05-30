<?php

use App\Models\Budget;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On;
use Livewire\Component;

new class extends Component
{
    public string $deletingId = '';
    public string $deletingName = '';

    #[On('open-delete-budget')]
    public function load(string $id, string $name): void
    {
        $this->deletingId = $id;
        $this->deletingName = $name;
    }

    public function delete(): void
    {
        Budget::where('familyId', Auth::user()->familyId)
            ->findOrFail($this->deletingId)
            ->delete();

        $this->reset(['deletingId', 'deletingName']);
        $this->dispatch('budget-deleted');
        $this->dispatch('flux:modal:close', name: 'delete-budget');
    }
}; ?>

<flux:modal name="delete-budget" class="max-w-sm" focusable>
    <div class="space-y-6">
        <div>
            <flux:heading size="lg">{{ __('Remover orçamento') }}</flux:heading>
            <flux:subheading>
                {{ __('Tem certeza que deseja remover o orçamento de') }}
                <strong class="text-neutral-900 dark:text-white">{{ $deletingName }}</strong>?
                {{ __('Esta ação não pode ser desfeita.') }}
            </flux:subheading>
        </div>

        <div class="flex justify-end gap-3">
            <flux:modal.close>
                <flux:button variant="ghost">{{ __('Cancelar') }}</flux:button>
            </flux:modal.close>
            <flux:button variant="danger" wire:click="delete">
                {{ __('Remover') }}
            </flux:button>
        </div>
    </div>
</flux:modal>
