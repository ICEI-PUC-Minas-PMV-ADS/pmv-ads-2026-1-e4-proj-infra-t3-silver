@extends('layouts.app')

@section('content')
<div class="flex-1 p-8">
    <div class="flex flex-col">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-3xl font-bold">Transactions</h1>
            <div class="flex items-center">
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v4a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zm0 8a1 1 0 01-1 1v4a1 1 0 001 1 1 1 0 001-1V9a1 1 0 00-2 0V6a1 1 0 011 1zm-1 0V7a1 1 0 00-2 0V4a1 1 0 011-1 1 1 0 011 1v1a1 1 0 001 1z"></path>
                    </svg>
                    New Transaction
                </button>
            </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
                <div class="overflow-x-auto">
                    <table class="w-full whitespace-no-wrap">
                        <thead>
                            <tr class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th class="py-3">ID</th>
                                <th class="py-3">Date</th>
                                <th class="py-3">Description</th>
                                <th class="py-3">Type</th>
                                <th class="py-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                                <td class="py-4 px-6 text-sm font-medium">{{ transaction.id }}</td>
                                <td class="py-4 px-6 text-sm">{{ transaction.created_at }}</td>
                                <td class="py-4 px-6 text-sm">{{ transaction.description }}</td>
                                <td class="py-4 px-6 text-sm">
                                    <span v-if="transaction.type === 'entrada'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {{ transaction.type }}
                                    </span>
                                    <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        {{ transaction.type }}
                                    </span>
                                </td>
                                <td class="py-4 px-6 text-sm">${{ transaction.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection