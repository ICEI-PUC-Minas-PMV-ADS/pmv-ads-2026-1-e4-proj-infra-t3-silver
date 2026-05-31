<x-layouts::app :title="__('Nova meta')">
    <div class="flex h-full w-full flex-1 flex-col gap-6 rounded-xl">

        <div>
            <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Nova meta
            </h1>
            <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Cadastre uma nova meta financeira.
            </p>
        </div>

        <div class="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-zinc-900">
            <form action="{{ route('goals.store') }}" method="POST" class="space-y-5">
                @csrf

                @include('goals._form', ['goal' => null])

                <div class="flex items-center justify-end gap-3">
                    <a href="{{ route('goals.index') }}"
                       class="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-neutral-700 dark:hover:bg-zinc-800">
                        Cancelar
                    </a>

                    <button type="submit"
                            class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                        Salvar meta
                    </button>
                </div>
            </form>
        </div>
    </div>
</x-layouts::app>