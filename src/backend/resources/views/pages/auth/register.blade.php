<x-layouts::auth :title="__('Cadastro')">
    <div class="flex flex-col gap-6">
        <x-auth-header :title="__('Crie sua conta')" :description="__('Preencha os dados abaixo para comecar')" />

        <!-- Session Status -->
        <x-auth-session-status class="text-center" :status="session('status')" />

        <form method="POST" action="{{ route('register') }}" class="flex flex-col gap-6">
            @csrf
            <!-- Name -->
            <flux:input
                name="name"
                :label="__('Nome')"
                :value="old('name')"
                type="text"
                required
                autofocus
                autocomplete="name"
                :placeholder="__('Nome completo')"
            />

            <!-- Email Address -->
            <flux:input
                name="email"
                :label="__('E-mail')"
                :value="old('email')"
                type="email"
                required
                autocomplete="email"
                placeholder="email@example.com"
            />

            <!-- Password -->
            <flux:input
                name="password"
                :label="__('Senha')"
                type="password"
                required
                autocomplete="new-password"
                :placeholder="__('Senha')"
                viewable
            />

            <!-- Confirm Password -->
            <flux:input
                name="password_confirmation"
                :label="__('Confirmar senha')"
                type="password"
                required
                autocomplete="new-password"
                :placeholder="__('Confirmar senha')"
                viewable
            />

            <div class="flex items-center justify-end">
                <flux:button type="submit" variant="primary" class="w-full" data-test="register-user-button">
                    {{ __('Criar conta') }}
                </flux:button>
            </div>
        </form>

        <div class="space-x-1 rtl:space-x-reverse text-center text-sm text-zinc-600 dark:text-zinc-400">
            <span>{{ __('Ja possui conta?') }}</span>
            <flux:link :href="route('login')" wire:navigate>{{ __('Entrar') }}</flux:link>
        </div>
    </div>
</x-layouts::auth>
