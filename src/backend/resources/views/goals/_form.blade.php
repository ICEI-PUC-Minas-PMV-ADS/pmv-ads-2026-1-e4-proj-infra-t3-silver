<div>
    <label class="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Título
    </label>

    <input type="text"
           name="title"
           value="{{ old('title', $goal->title ?? '') }}"
           class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-neutral-700 dark:bg-zinc-950 dark:text-zinc-100"
           required>

    @error('title')
        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>

<div>
    <label class="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Descrição
    </label>

    <textarea name="description"
              rows="4"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-neutral-700 dark:bg-zinc-950 dark:text-zinc-100">{{ old('description', $goal->description ?? '') }}</textarea>

    @error('description')
        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>

<div class="grid gap-5 md:grid-cols-2">
    <div>
        <label class="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Valor alvo
        </label>

        <input type="number"
               step="0.01"
               min="0"
               name="target_amount"
               value="{{ old('target_amount', $goal->target_amount ?? '') }}"
               class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-neutral-700 dark:bg-zinc-950 dark:text-zinc-100"
               required>

        @error('target_amount')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Valor atual
        </label>

        <input type="number"
               step="0.01"
               min="0"
               name="current_amount"
               value="{{ old('current_amount', $goal->current_amount ?? 0) }}"
               class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-neutral-700 dark:bg-zinc-950 dark:text-zinc-100">

        @error('current_amount')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>
</div>

<div class="grid gap-5 md:grid-cols-2">
    <div>
        <label class="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Prazo
        </label>

        <input type="date"
               name="deadline"
               value="{{ old('deadline', isset($goal) && $goal?->deadline ? \Carbon\Carbon::parse($goal->deadline)->format('Y-m-d') : '') }}"
               class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-neutral-700 dark:bg-zinc-950 dark:text-zinc-100">

        @error('deadline')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Status
        </label>

        <select name="status"
                class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-neutral-700 dark:bg-zinc-950 dark:text-zinc-100">
            @php
                $statusAtual = old('status', $goal->status ?? 'ativa');
            @endphp

            <option value="ativa" @selected($statusAtual === 'ativa')>Ativa</option>
            <option value="concluida" @selected($statusAtual === 'concluida')>Concluída</option>
            <option value="cancelada" @selected($statusAtual === 'cancelada')>Cancelada</option>
        </select>

        @error('status')
            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>
</div>