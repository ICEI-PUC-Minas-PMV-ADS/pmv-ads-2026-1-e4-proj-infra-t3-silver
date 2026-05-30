<?php

use Livewire\Component;
use Livewire\Attributes\Title;

new #[Title('Configuracoes de aparencia')] class extends Component {
    //
}; ?>

<section class="w-full">
    @include('partials.settings-heading')

    <flux:heading class="sr-only">{{ __('Configuracoes de aparencia') }}</flux:heading>

    <x-pages::settings.layout :heading="__('Aparencia')" :subheading="__('Atualize as preferencias visuais da sua conta')">
        <flux:radio.group x-data variant="segmented" x-model="$flux.appearance">
            <flux:radio value="light" icon="sun">{{ __('Claro') }}</flux:radio>
            <flux:radio value="dark" icon="moon">{{ __('Escuro') }}</flux:radio>
            <flux:radio value="system" icon="computer-desktop">{{ __('Sistema') }}</flux:radio>
        </flux:radio.group>
    </x-pages::settings.layout>
</section>
