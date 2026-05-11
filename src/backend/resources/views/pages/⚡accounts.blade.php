<?php

use App\Models\Account;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

new #[Title('Contas')] #[Layout('layouts::app')] class extends Component
{
    public string $accountId = '';
    public string $name = '';
    public string $type = 'Checking';
    public $balance = 0.0;
    public string $color = '#3b82f6';

    #[Computed]
    public function accounts()
    {
        return Account::where('familyId', Auth::user()->familyId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    #[Computed]
    public function totalBalance()
    {
        return $this->accounts->sum('balance');
    }

    public function save()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'balance' => 'required|numeric',
            'color' => 'required|string|max:20',
        ]);

        if ($this->accountId) {
            $account = Account::where('familyId', Auth::user()->familyId)->findOrFail($this->accountId);
            $account->update([
                'name' => $this->name,
                'type' => $this->type,
                'balance' => (float) $this->balance,
                'color' => $this->color,
            ]);
        } else {
            Account::create([
                'name' => $this->name,
                'type' => $this->type,
                'balance' => (float) $this->balance,
                'color' => $this->color,
                'familyId' => Auth::user()->familyId,
                'userId' => Auth::id(),
            ]);
        }

        $this->resetForm();
        unset($this->accounts, $this->totalBalance);
        $this->dispatch('close-modal', 'account-modal');
    }

    public function edit(string $id)
    {
        $account = Account::where('familyId', Auth::user()->familyId)->findOrFail($id);
        $this->accountId = (string) ($account->_id ?? $account->id);
        $this->name = $account->name;
        $this->type = $account->type;
        $this->balance = $account->balance;
        $this->color = $account->color ?? '#3b82f6';
        $this->dispatch('open-modal', 'account-modal');
    }

    public function confirmDelete(string $id)
    {
        $this->accountId = $id;
        $this->dispatch('open-modal', 'delete-account-modal');
    }

    public function delete()
    {
        Account::where('familyId', Auth::user()->familyId)->findOrFail($this->accountId)->delete();
        $this->resetForm();
        unset($this->accounts, $this->totalBalance);
        $this->dispatch('close-modal', 'delete-account-modal');
    }

    public function resetForm()
    {
        $this->reset(['accountId', 'name', 'type', 'balance', 'color']);
        $this->type = 'Checking';
        $this->color = '#3b82f6';
        $this->resetValidation();
    }
}; ?>

<div class="flex h-full w-full flex-1 flex-col gap-6 p-6">
    {{-- Cabeçalho --}}
    <div class="flex items-center justify-between">
        <div>
            <flux:heading size="xl" level="1">{{ __('Contas') }}</flux:heading>
            <flux:subheading>{{ __('Gerencie suas contas e carteiras') }}</flux:subheading>
        </div>
        <flux:modal.trigger name="account-modal">
            <flux:button variant="primary" icon="plus" wire:click="resetForm">
                {{ __('Nova Conta') }}
            </flux:button>
        </flux:modal.trigger>
    </div>

    {{-- Resumo --}}
    <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
            <flux:text class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {{ __('Saldo Consolidado') }}
            </flux:text>
            <p class="mt-1 text-2xl font-semibold {{ $this->totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }}">
                R$ {{ number_format($this->totalBalance, 2, ',', '.') }}
            </p>
        </div>
    </div>

    {{-- Lista de Contas --}}
    @if ($this->accounts->isEmpty())
        <div class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
            <div class="rounded-full bg-neutral-100 p-4 dark:bg-zinc-800">
                <flux:icon name="building-library" class="size-8 text-neutral-400" />
            </div>
            <flux:heading>{{ __('Nenhuma conta cadastrada') }}</flux:heading>
            <flux:subheading class="text-center">
                {{ __('Crie uma conta para começar a registrar suas transações.') }}
            </flux:subheading>
            <flux:modal.trigger name="account-modal">
                <flux:button variant="primary" icon="plus" class="mt-2" wire:click="resetForm">
                    {{ __('Criar conta') }}
                </flux:button>
            </flux:modal.trigger>
        </div>
    @else
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            @foreach ($this->accounts as $account)
                <div class="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex min-w-0 items-center gap-3">
                            <div class="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" style="background-color: {{ $account->color ?? '#6b7280' }}">
                                <flux:icon name="banknotes" class="size-5" />
                            </div>
                            <div class="min-w-0">
                                <p class="truncate font-semibold text-neutral-900 dark:text-white">
                                    {{ $account->name }}
                                </p>
                                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                                    {{ $account->type }}
                                </p>
                            </div>
                        </div>
                        <div class="flex shrink-0 gap-1">
                            <flux:button size="sm" variant="ghost" icon="pencil" wire:click="edit('{{ $account->_id ?? $account->id }}')" />
                            <flux:button size="sm" variant="ghost" icon="trash" class="!text-red-500 hover:!text-red-600 dark:!text-red-400" wire:click="confirmDelete('{{ $account->_id ?? $account->id }}')" />
                        </div>
                    </div>
                    <div class="mt-2">
                        <p class="text-2xl font-semibold {{ $account->balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }}">
                            R$ {{ number_format($account->balance, 2, ',', '.') }}
                        </p>
                    </div>
                </div>
            @endforeach
        </div>
    @endif

    {{-- Modal Criar/Editar --}}
    <flux:modal name="account-modal" class="md:w-96">
        <form wire:submit="save" class="space-y-6">
            <div>
                <flux:heading size="lg">{{ $accountId ? __('Editar Conta') : __('Nova Conta') }}</flux:heading>
                <flux:subheading>{{ __('Preencha os dados da conta financeira.') }}</flux:subheading>
            </div>
            
            <flux:input wire:model="name" label="{{ __('Nome da Conta') }}" placeholder="Ex: Nubank, Carteira..." />
            
            <flux:select wire:model="type" label="{{ __('Tipo de Conta') }}">
                <flux:select.option value="Checking">{{ __('Conta Corrente') }}</flux:select.option>
                <flux:select.option value="Savings">{{ __('Poupança') }}</flux:select.option>
                <flux:select.option value="Investment">{{ __('Investimentos') }}</flux:select.option>
                <flux:select.option value="Cash">{{ __('Dinheiro em Espécie') }}</flux:select.option>
                <flux:select.option value="Other">{{ __('Outro') }}</flux:select.option>
            </flux:select>
            
            <flux:input wire:model="balance" type="number" step="0.01" label="{{ __('Saldo Atual') }}" />
            
            <flux:input wire:model="color" type="color" label="{{ __('Cor de Identificação') }}" />

            <div class="flex justify-end gap-2">
                <flux:modal.close>
                    <flux:button variant="ghost">{{ __('Cancelar') }}</flux:button>
                </flux:modal.close>
                <flux:button type="submit" variant="primary">{{ __('Salvar') }}</flux:button>
            </div>
        </form>
    </flux:modal>

    {{-- Modal Excluir --}}
    <flux:modal name="delete-account-modal" class="md:w-96">
        <form wire:submit="delete" class="space-y-6">
            <div>
                <flux:heading size="lg">{{ __('Excluir Conta') }}</flux:heading>
                <flux:subheading>{{ __('Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.') }}</flux:subheading>
            </div>
            
            <div class="flex justify-end gap-2">
                <flux:modal.close>
                    <flux:button variant="ghost">{{ __('Cancelar') }}</flux:button>
                </flux:modal.close>
                <flux:button type="submit" variant="danger">{{ __('Excluir') }}</flux:button>
            </div>
        </form>
    </flux:modal>
</div>
