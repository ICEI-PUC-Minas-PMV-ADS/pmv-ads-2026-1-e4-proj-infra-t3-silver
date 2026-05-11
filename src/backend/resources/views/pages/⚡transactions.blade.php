<?php
  /*  resources/views/pages/transactions.blade.php  */
  use App\Models\Transaction;
  use Illuminate\Support\Facades\Auth;
  use Livewire\Attributes\Title;
  use Livewire\Attributes\Computed;
  use Livewire\Attributes\On;
  use Livewire\Component;
  use Carbon\Carbon;

  new #[Title('Transações')] class extends Component
  {
      /* --------------------------------------------------------------
         Dados “computados” – usados no markup
         -------------------------------------------------------------- */
      #[Computed] public function familyId()   { return Auth::user()->familyId; }

      /** Total de receitas da família (todos os períodos) */
      #[Computed] public function totalIncome()
      {
          return Transaction::where('familyId', $this->familyId)
              ->where('type', 'income')
              ->sum('amount');
      }

      /** Total de despesas da família (todos os períodos) */
      #[Computed] public function totalExpense()
      {
          return Transaction::where('familyId', $this->familyId)
              ->where('type', 'expense')
              ->sum('amount');
      }

      /** Saldo = receita – despesa */
      #[Computed] public function balance()
      {
          return $this->totalIncome - $this->totalExpense;
      }

      /** Últimas 20 transações (usado na tabela) */
      #[Computed] public function recent()
      {
          return Transaction::where('familyId', $this->familyId)
              ->latest('date')
              ->take(20)
              ->get();
      }

      /* --------------------------------------------------------------
         Campos do formulário (usado no modal “Nova transação”)
         -------------------------------------------------------------- */
      public $accountId   = '';
      public $categoryId  = '';
      public $type        = 'income';   // income | expense
      public $amount      = '';
      public $description = '';
      public $date        = '';

      /** Salva a transação */
      public function store()
      {
          $data = $this->validate([
              'accountId'   => 'required|string',
              'categoryId'  => 'required|string',
              'type'        => 'required|in:income,expense',
              'amount'      => 'required|numeric|min:0.01',
              'description' => 'required|string|max:500',
              'date'        => 'nullable|date',
          ]);

          Transaction::create(array_merge($data, [
              'familyId' => $this->familyId,
              'userId'   => Auth::id(),
              'date'     => $data['date'] ?? now(),
              'source'   => 'web',
          ]));

          $this->reset(['accountId','categoryId','type','amount','description','date']);
          $this->dispatch('refresh-list');
          $this->dispatch('flux:modal:close', name: 'new-transaction');
      }

      /** Remove a transação */
      public function destroy($id)
      {
          Transaction::where('familyId', $this->familyId)
              ->findOrFail($id)
              ->delete();

          $this->dispatch('refresh-list');
      }

      /* --------------------------------------------------------------
         Ouvir eventos do modal (para fechar/resetar)
         -------------------------------------------------------------- */
      #[On('refresh-list')] public function refresh() { unset($this->recent); }
  };
  ?>
  <x-layouts::app :title="__('Transações')">
  
      <div class="p-6 space-y-8">

          {{-- -------------------  RESUMO DO BALANÇO  ------------------- --}}
          <div class="grid gap-4 md:grid-cols-3">
              <div class="rounded-xl border bg-white dark:bg-neutral-800 p-5 shadow-sm">
                  <flux:heading size="sm" class="text-neutral-500 uppercase">
                      {{ __('Saldo Atual') }}
                  </flux:heading>
                  <p class="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                      R$ {{ number_format($this->balance, 2, ',', '.') }}
                  </p>
              </div>

              <div class="rounded-xl border bg-white dark:bg-neutral-800 p-5 shadow-sm">
                  <flux:heading size="sm" class="text-neutral-500 uppercase">
                      {{ __('Receitas') }}
                  </flux:heading>
                  <p class="mt-2 text-3xl font-bold text-green-600">
                      + R$ {{ number_format($this->totalIncome, 2, ',', '.') }}
                  </p>
              </div>

              <div class="rounded-xl border bg-white dark:bg-neutral-800 p-5 shadow-sm">
                  <flux:heading size="sm" class="text-neutral-500 uppercase">
                      {{ __('Despesas') }}
                  </flux:heading>
                  <p class="mt-2 text-3xl font-bold text-red-600">
                      - R$ {{ number_format($this->totalExpense, 2, ',', '.') }}
                  </p>
              </div>
          </div>

          {{-- -------------------  BOTÃO “NOVA TRANSAÇÃO”  ------------------- --}}
          <div class="flex justify-end">
              <flux:modal.trigger name="new-transaction">
                  <flux:button variant="primary" icon="plus">
                      {{ __('Nova transação') }}
                  </flux:button>
              </flux:modal.trigger>
          </div>

          {{-- -------------------  TABELA DE TRANSAÇÕES RECENTES  ------------------- --}}
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200
  dark:border-neutral-700 overflow-hidden">
              <div class="p-4">
                  <flux:heading size="lg">{{ __('Transações recentes') }}</flux:heading>
              </div>

              <div class="overflow-x-auto">
                  <table class="min-w-full text-left">
                      <thead class="bg-neutral-50 dark:bg-neutral-900/50 text-xs uppercase
  text-neutral-500">
                          <tr>
                              <th class="px-4 py-2">{{ __('Data') }}</th>
                              <th class="px-4 py-2">{{ __('Tipo') }}</th>
                              <th class="px-4 py-2">{{ __('Descrição') }}</th>
                              <th class="px-4 py-2">{{ __('Valor') }}</th>
                              <th class="px-4 py-2">{{ __('Ações') }}</th>
                          </tr>
                      </thead>
                      <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
                          @forelse($this->recent as $t)
                              <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/30">
                                  <td class="px-4 py-2">{{ $t->date->format('d/m/Y') }}</td>
                                  <td class="px-4 py-2">
                                      <span class="{{ $t->type === 'income' ? 'text-green-600' :
  'text-red-600' }}">
                                          {{ $t->type === 'income' ? __('Receita') : __('Despesa') }}
                                      </span>
                                  </td>
                                  <td class="px-4 py-2">{{ $t->description }}</td>
                                  <td class="px-4 py-2 font-medium {{ $t->type === 'income' ?
  'text-green-600' : 'text-red-600' }}">
                                      {{ $t->type === 'income' ? '+' : '-' }} R$ {{
  number_format($t->amount, 2, ',', '.') }}
                                  </td>
                                  <td class="px-4 py-2">
                                      <button
                                          wire:click="destroy({{ $t->id }})"
                                          class="text-sm text-red-600 hover:underline"
                                          onclick="return confirm('{{ __('Excluir esta transação?')
  }}')">
                                          {{ __('Excluir') }}
                                      </button>
                                  </td>
                              </tr>
                          @empty
                              <tr>
                                  <td colspan="5" class="p-8 text-center text-neutral-500">
                                      {{ __('Nenhuma transação cadastrada ainda.') }}
                                  </td>
                              </tr>
                          @endforelse
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {{-- ====================  MODAL “NOVA TRANSAÇÃO”  ==================== --}}
      <flux:modal name="new-transaction" class="md:w-96">
          <form wire:submit="store" class="space-y-6">
              <div>
                  <flux:heading size="lg">{{ __('Nova Transação') }}</flux:heading>
                  <flux:subheading>{{ __('Adicione uma nova receita ou despesa.') }}</flux:subheading>
              </div>
              
              <flux:select wire:model="type" label="{{ __('Tipo') }}">
                  <flux:select.option value="income">{{ __('Receita') }}</flux:select.option>
                  <flux:select.option value="expense">{{ __('Despesa') }}</flux:select.option>
              </flux:select>
              
              <flux:input wire:model="amount" type="number" step="0.01" label="{{ __('Valor') }}" />
              
              <flux:input wire:model="description" label="{{ __('Descrição') }}" placeholder="Ex: Conta de Luz" />
              
              <flux:input wire:model="date" type="date" label="{{ __('Data') }}" />
              
              <flux:input wire:model="accountId" label="{{ __('ID da Conta') }}" placeholder="Cole o ID da conta aqui" />
              <flux:input wire:model="categoryId" label="{{ __('ID da Categoria') }}" placeholder="Cole o ID da categoria aqui" />
              
              <div class="flex justify-end gap-2">
                  <flux:modal.close>
                      <flux:button variant="ghost">{{ __('Cancelar') }}</flux:button>
                  </flux:modal.close>
                  <flux:button type="submit" variant="primary">{{ __('Salvar') }}</flux:button>
              </div>
          </form>
      </flux:modal>
  </x-layouts::app>
