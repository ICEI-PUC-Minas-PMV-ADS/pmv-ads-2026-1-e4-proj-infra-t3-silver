<x-layouts::app :title="__('Detalhes da meta')">
    <div class="flex h-full w-full flex-1 flex-col gap-6 rounded-xl">

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {{ $goal->title }}
                </h1>
                <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Detalhes da meta selecionada.
                </p>
            </div>

            <div class="flex gap-2">
                <a href="{{ route('goals.index') }}"
                   class="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-neutral-700 dark:hover:bg-zinc-800">
                    Voltar
                </a>

                <a href="{{ route('goals.edit', $goal->_id) }}"
                   class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                    Editar
                </a>
            </div>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
                <p class="text-sm text-zinc-500 dark:text-zinc-400">Valor atual</p>
                <p class="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    R$ {{ number_format((float) $goal->current_amount, 2, ',', '.') }}
                </p>
            </div>

            <div class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
                <p class="text-sm text-zinc-500 dark:text-zinc-400">Valor alvo</p>
                <p class="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    R$ {{ number_format((float) $goal->target_amount, 2, ',', '.') }}
                </p>
            </div>

            <div class="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-zinc-900">
                <p class="text-sm text-zinc-500 dark:text-zinc-400">Status</p>
                <p class="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {{ ucfirst($goal->status ?? 'ativa') }}
                </p>
            </div>
        </div>

        <div class="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-zinc-900">
            <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Descrição
            </h2>

            <p class="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {{ $goal->description ?: 'Nenhuma descrição informada.' }}
            </p>

            <div class="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Prazo:</strong>
                {{ $goal->deadline ? \Carbon\Carbon::parse($goal->deadline)->format('d/m/Y') : 'Não informado' }}
            </div>
        </div>
    </div>
</x-layouts::app>