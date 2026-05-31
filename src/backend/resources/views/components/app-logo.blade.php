@props([
    'sidebar' => false,
])

@if($sidebar)
    <flux:sidebar.brand name="Silver" {{ $attributes }}>
        <x-slot name="logo" class="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
            <x-app-logo-icon class="size-8 object-cover" />
        </x-slot>
    </flux:sidebar.brand>
@else
    <flux:brand name="Silver" {{ $attributes }}>
        <x-slot name="logo" class="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
            <x-app-logo-icon class="size-8 object-cover" />
        </x-slot>
    </flux:brand>
@endif
