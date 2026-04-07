@extends('layouts.app')

@section('content')
<div class="flex-1 p-8">
    <div class="flex flex-col">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold">Dashboard</h1>
            <div class="flex items-center">
                <div class="relative">
                    <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v4a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zm0 8a1 1 0 01-1 1v4a1 1 0 001 1 1 1 0 001-1V9a1 1 0 00-2 0V6a1 1 0 011 1zm-1 0V7a1 1 0 00-2 0V4a1 1 0 011-1 1 1 0 011 1v1a1 1 0 001 1z"></path>
                        </svg>
                        Settings
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Recent Transactions -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="p-6">
                        <h2 class="text-lg font-bold">Recent Transactions</h2>
                        <div class="mt-4">
                            <div x-data="{ open: false }" class="relative">
                                <button @click="open = !open" class="w-full flex items-center justify-between px-4 py-3 border-b hover:bg-gray-50">
                                    <span class="font-medium">View All</span>
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zm3 2a1 1 0 100 2h-7a1 1 0 100-2zm-7 4a1 1 0 011-1v2a1 1 0 101 1H9a1 1 0 101-1V7a1 1 0 00-2 0z"></path>
                                    </svg>
                                </button>
                                <div x-show="open" x-cloak class="mt-2">
                                    <div class="overflow-y-auto h-64">
                                        <div class="p-4">
                                            <div v-for="transaction in transactions" :key="transaction.id" class="flex items-center mb-2">
                                                <div class="w-4 h-4 bg-indigo-500 rounded-full"></div>
                                                <div class="ml-3">
                                                    <div class="font-medium">Transaction {{ transaction.id }}</div>
                                                    <div class="text-gray-500">{{ transaction.type }} | {{ transaction.created_at }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Balance -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="p-6">
                        <h2 class="text-lg font-bold">Balance</h2>
                        <div class="mt-4">
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                                <div class="ml-3">
                                    <h3 class="text-2xl font-bold">$ {{ $balance }}</h3>
                                    <p class="text-gray-500">Total Balance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="p-6">
                        <h2 class="text-lg font-bold">Summary</h2>
                        <div class="mt-4">
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                                <div class="ml-3">
                                    <h3 class="text-xl font-bold">$ {{ $entries }}</h3>
                                    <p class="text-gray-500">Total Inflows</p>
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="flex items-center">
                                    <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                                    <div class="ml-3">
                                        <h3 class="text-xl font-bold">$ {{ $exits }}</h3>
                                        <p class="text-gray-500">Total Outflows</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection