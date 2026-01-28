<script lang="ts">
    import Report from '$lib/components/pages/home/Report.svelte';
    import type { ReportData } from '$lib/scripts/types/report.types.js';

    let apiKey = $state('');
    let periodType = $state<'monthly' | 'quarterly' | 'yearly' | 'all-time' | 'custom'>('monthly');
    let selectedMonth = $state(new Date().toISOString().slice(0, 7));
    let selectedYear = $state(new Date().getFullYear());
    let selectedQuarter = $state(Math.floor(new Date().getMonth() / 3) + 1);
    let customStart = $state('');
    let customEnd = $state('');
    let errorMessage = $state('');

    const dateRange = $derived(() => {
        let start = '';
        let end = '';
        
        switch (periodType) {
            case 'monthly':
                if (selectedMonth) {
                    const [y, m] = selectedMonth.split('-').map(Number);
                    start = `${selectedMonth}-01`;
                    end = new Date(y, m, 0).toISOString().slice(0, 10);
                }
                break;
            case 'quarterly':
                const qStartMonth = (selectedQuarter - 1) * 3;
                start = new Date(selectedYear, qStartMonth, 1).toISOString().slice(0, 10);
                end = new Date(selectedYear, qStartMonth + 3, 0).toISOString().slice(0, 10);
                break;
            case 'yearly':
                start = `${selectedYear}-01-01`;
                end = `${selectedYear}-12-31`;
                break;
            case 'all-time':
                start = '2020-01-01'; 
                end = new Date().toISOString().slice(0, 10);
                break;
            case 'custom':
                start = customStart;
                end = customEnd;
                break;
        }
        return { start, end };
    });

    const periodLabel = $derived(() => {
        switch (periodType) {
            case 'monthly':
                if (selectedMonth) {
                    const date = new Date(selectedMonth + '-01T00:00:00');
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                }
                break;
            case 'quarterly':
                return `Q${selectedQuarter} ${selectedYear}`;
            case 'yearly':
                return `${selectedYear}`;
            case 'all-time':
                return 'All Time';
            case 'custom':
                if (customStart && customEnd) return `${customStart} to ${customEnd}`;
                break;
        }
        return '';
    });

    let reportData: ReportData | null = $state(null);
    let isGenerating = $state(false);

    async function generateReport() {
        if (!apiKey) {
            errorMessage = 'Please enter an API Key to generate the report.';
            return;
        }

        isGenerating = true;
        errorMessage = '';
        const { start, end } = dateRange();
        
        try {
            const response = await fetch('/api/report/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    apiKey, 
                    startDate: start, 
                    endDate: end, 
                    customPeriod: periodLabel() 
                })
            });

            if (response.ok) {
                reportData = await response.json();
            } else {
                const errorData = (await response.json()) as { error?: string };
                errorMessage = errorData.error || 'Failed to generate report';
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            errorMessage = 'An unexpected error occurred while generating the report.';
        } finally {
            isGenerating = false;
        }
    }

    function printReport() {
        window.print();
    }
</script>

<div class="flex h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible print:block">
    <!-- Sidebar -->
    <aside class="w-80 bg-primary text-white flex flex-col shadow-xl z-10 print:hidden">
        <div class="p-6 border-b border-white/10">
            <h1 class="text-xl font-black tracking-tight uppercase">Report Generator</h1>
            <p class="text-xs text-white/60 mt-1">Configure your security report</p>
        </div>

        <div class="flex-grow p-6 space-y-6 overflow-y-auto">
            <div class="space-y-2">
                <label for="apiKey" class="text-[10px] font-black uppercase tracking-widest text-white/50">API Key</label>
                <input 
                    type="password" 
                    id="apiKey"
                    bind:value={apiKey}
                    placeholder="Enter your API Key"
                    class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white"
                />
            </div>

            <div class="space-y-4">
                <p class="text-[10px] font-black uppercase tracking-widest text-white/50">Report Period</p>
                
                <div class="space-y-2">
                    <label for="periodType" class="text-xs text-white/70">Type</label>
                    <select 
                        id="periodType"
                        bind:value={periodType}
                        class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white [color-scheme:dark] *:bg-primary"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="all-time">All Time</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {#if periodType === 'monthly'}
                    <div class="space-y-2">
                        <label for="monthPicker" class="text-xs text-white/70">Select Month</label>
                        <input 
                            type="month" 
                            id="monthPicker"
                            bind:value={selectedMonth}
                            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white [color-scheme:dark]"
                        />
                    </div>
                {:else if periodType === 'quarterly'}
                    <div class="grid grid-cols-2 gap-2">
                        <div class="space-y-2">
                            <label for="quarterPicker" class="text-xs text-white/70">Quarter</label>
                            <select 
                                id="quarterPicker"
                                bind:value={selectedQuarter}
                                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white [color-scheme:dark] *:bg-primary"
                            >
                                <option value={1}>Q1</option>
                                <option value={2}>Q2</option>
                                <option value={3}>Q3</option>
                                <option value={4}>Q4</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label for="yearPicker" class="text-xs text-white/70">Year</label>
                            <input 
                                type="number" 
                                id="yearPicker"
                                bind:value={selectedYear}
                                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white"
                            />
                        </div>
                    </div>
                {:else if periodType === 'yearly'}
                    <div class="space-y-2">
                        <label for="yearPickerOnly" class="text-xs text-white/70">Select Year</label>
                        <input 
                            type="number" 
                            id="yearPickerOnly"
                            bind:value={selectedYear}
                            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white"
                        />
                    </div>
                {:else if periodType === 'custom'}
                    <div class="space-y-2">
                        <label for="customStart" class="text-xs text-white/70">Start Date</label>
                        <input 
                            type="date" 
                            id="customStart"
                            bind:value={customStart}
                            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white [color-scheme:dark]"
                        />
                    </div>
                    <div class="space-y-2">
                        <label for="customEnd" class="text-xs text-white/70">End Date</label>
                        <input 
                            type="date" 
                            id="customEnd"
                            bind:value={customEnd}
                            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-white [color-scheme:dark]"
                        />
                    </div>
                {/if}
            </div>

            <button 
                onclick={generateReport}
                disabled={isGenerating}
                class="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {#if isGenerating}
                    <div class="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    Generating...
                {:else}
                    Generate Report
                {/if}
            </button>
        </div>

        <div class="p-6 border-t border-white/10 bg-black/20">
            <button 
                onclick={printReport}
                class="w-full border border-white/20 hover:bg-white/5 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print / Download
            </button>
        </div>
    </aside>

    <!-- Preview Area -->
    <main class="flex-1 overflow-y-auto bg-gray-100 p-8 print:p-0 print:bg-white print:block print:h-auto print:overflow-visible">
        {#if errorMessage}
            <div class="max-w-5xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <p class="text-sm font-medium">{errorMessage}</p>
                <button onclick={() => errorMessage = ''} class="ml-auto hover:text-red-900 transition-colors" aria-label="Dismiss error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        {/if}

        {#if reportData}
            <div class="flex justify-center origin-top transform scale-[0.7] sm:scale-[0.85] xl:scale-100 transition-transform print:transform-none print:scale-100 print:block">
                <Report data={reportData} />
            </div>
        {:else if isGenerating}
            <div class="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p class="font-medium animate-pulse">Generating your live preview...</p>
            </div>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <p class="font-medium">Configure and generate a report to see the preview</p>
            </div>
        {/if}
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    
    @media print {
        :global(body) {
            background: white !important;
            overflow: visible !important;
            height: auto !important;
        }
        aside {
            display: none !important;
        }
        main {
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            height: auto !important;
        }
        .transform {
            transform: none !important;
            scale: none !important;
        }
    }
</style>
