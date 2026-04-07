<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="/js/app.js" defer></script>
</head>
<body class="bg-gray-100">
    <div class="relative">
        <!-- Sidebar -->
        <div class="fixed top-0 left-0 z-10 bg-white w-64 h-screen overflow-y-auto shadow-lg">
            <div class="p-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-indigo-500 rounded-full"></div>
                    <div class="ml-3">
                        <h2 class="text-xl font-bold">Finance Dashboard</h2>
                    </div>
                </div>
                <div class="mt-6">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-50">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 12a1 1 0 001-1 1 1 0 00-2 0v3a1 1 0 001 1 1 1 0 001-1V5a1 1 0 00-2 0V9a1 1 0 001 1zm-1 0V7a1 1 0 00-2 0V4a1 1 0 011-1 1 1 0 011 1v1a1 1 0 001 1zm-1-1a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1zm9-6V4a1 1 0 00-2 0v3a1 1 0 001 1 1 1 0 001-1zm-1 0V7a1 1 0 00-2 0V4a1 1 0 011-1 1 1 0 011 1v1a1 1 0 001 1z"></path>
                            </svg>
                            Dashboard
                        </a>
                        <a href="/transactions" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-50">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v4a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zm0 8a1 1 0 01-1 1v4a1 1 0 001 1 1 1 0 001-1V9a1 1 0 00-2 0V4a1 1 0 011-1zm-1 0V7a1 1 0 00-2 0V4a1 1 0 011-1 1 1 0 011 1v1a1 1 0 001 1z"></path>
                            </svg>
                            Transactions
                        </a>
                        <a href="/settings" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-50">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1V6a1 1 0 011-1zm0 2a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1V8a1 1 0 011-1zm0 4a1 1 0 011 1v3a1 1 0 001-1 1 1 0 001-1H9a1 1 0 001 1z"></path>
                            </svg>
                            Settings
                        </a>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex flex-col w-full">
            <!-- Header -->
            <div class="bg-white shadow-md h-16 flex items-center px-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-indigo-500 rounded-full"></div>
                    <div class="ml-3">
                        <h2 class="text-xl font-bold">Dashboard</h2>
                    </div>
                </div>
                <div class="ml-auto">
                    <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        WhatsApp
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h.01M7 5a2 2 0 012-2h.01M13 5a2 2 0 012-2h.01M17 5a2 2 0 012-2h.01M3 15a2 2 0 002 2h.01M7 15a2 2 0 002 2h.01M13 15a2 2 0 002 2h.01M17 15a2 2 0 002 2h.01M3 25a2 2 0 012-2h.01M7 25a2 2 0 012-2h.01M13 25a2 2 0 012-2h.01M17 25a2 2 0 012-2h.01"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Content -->
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
                                                <h3 class="text-2xl font-bold">$ {{ balance }}</h3>
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
                                                <h3 class="text-xl font-bold">$ {{ entries }}</h3>
                                                <p class="text-gray-500">Total Inflows</p>
                                            </div>
                                        </div>
                                        <div class="mt-4">
                                            <div class="flex items-center">
                                                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                                                <div class="ml-3">
                                                    <h3 class="text-xl font-bold">$ {{ exits }}</h3>
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
        </div>
    </div>
</body>
</html>