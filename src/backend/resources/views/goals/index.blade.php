<x-layouts.app :title="__('Metas')">
    <div class="flex h-full w-full flex-1 flex-col gap-6 rounded-xl">

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Metas
                </h1>
                <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Gerencie suas metas financeiras.
                </p>
            </div>

            <a href="{{ route('goals.create') }}"
               class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                Nova meta
            </a>
        </div>

        @if (session('success'))
            <div class="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-200">
                {{ session('success') }}
            </div>
        @endif

        <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-zinc-900">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-neutral-200 bg-zinc-50 text-zinc-700 dark:border-neutral-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <tr>
                        <th class="px-4 py-3">Título</th>
                        <th class="px-4 py-3">Valor atual</th>
                        <th class="px-4 py-3">Valor alvo</th>
                        <th class="px-4 py-3">Prazo</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3 text-right">Ações</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
                    @forelse ($goals as $goal)
                        <tr class="text-zinc-800 dark:text-zinc-200">
                            <td class="px-4 py-3 font-medium">
                                {{ $goal->title }}
                            </td>

                            <td class="px-4 py-3">
                                R$ {{ number_format((float) $goal->current_amount, 2, ',', '.') }}
                            </td>

                            <td class="px-4 py-3">
                                R$ {{ number_format((float) $goal->target_amount, 2, ',', '.') }}
                            </td>

                            <td class="px-4 py-3">
                                {{ $goal->deadline ? \Carbon\Carbon::parse($goal->deadline)->format('d/m/Y') : '-' }}
                            </td>

                            <td class="px-4 py-3">
                                <span class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                    {{ ucfirst($goal->status ?? 'ativa') }}
                                </span>
                            </td>

                            <td class="px-4 py-3">
                                <div class="flex justify-end gap-2">
                                    <a href="{{ route('goals.show', $goal->_id) }}"
                                       class="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs hover:bg-zinc-100 dark:border-neutral-700 dark:hover:bg-zinc-800">
                                        Ver
                                    </a>

                                    <a href="{{ route('goals.edit', $goal->_id) }}"
                                       class="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs hover:bg-zinc-100 dark:border-neutral-700 dark:hover:bg-zinc-800">
                                        Editar
                                    </a>

                                    <form action="{{ route('goals.destroy', $goal->_id) }}"
                                          method="POST"
                                          onsubmit="return confirm('Deseja realmente excluir esta meta?')">
                                        @csrf
                                        @method('DELETE')

                                        <button type="submit"
                                                class="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
                                            Excluir
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400">
                                Nenhuma meta cadastrada ainda.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-layouts.app>