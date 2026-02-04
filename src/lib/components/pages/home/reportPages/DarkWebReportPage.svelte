<script lang="ts">
    import type { ReportData } from '$lib/scripts/types/report.types.js';
    import ReportPage from '../layout/ReportPage.svelte';
    import ReportSection from '../layout/ReportSection.svelte';

    let { data, pageNumber, totalPages }: { data: ReportData, pageNumber: number, totalPages: number } = $props();
</script>

<ReportPage 
    {pageNumber} 
    {totalPages}
    reportPeriodLabel={data.reportPeriodLabel}
    branding={data.branding}
>
    <ReportSection title="Dark Web Monitoring" isMain={true}>
        <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl"></div>
                <p class="text-foreground/40 text-[10px] uppercase font-black tracking-[0.2em] mb-4">Total Exposures</p>
                <p class="text-2xl font-black text-primary tracking-tighter">{data.darkWebReport.totalExposures}</p>
                <p class="text-foreground/50 text-[10px] mt-4 font-medium italic">Detected across monitored forums</p>
            </div>
            <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-3xl"></div>
                <p class="text-foreground/40 text-[10px] uppercase font-black tracking-[0.2em] mb-4">High Risk</p>
                <p class="text-2xl font-black text-red-600 tracking-tighter">{data.darkWebReport.highRiskExposures}</p>
                <p class="text-foreground/50 text-[10px] mt-4 font-medium italic">Requiring immediate attention</p>
            </div>
            <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl"></div>
                <p class="text-foreground/40 text-[10px] uppercase font-black tracking-[0.2em] mb-4">Compromised Accounts</p>
                <p class="text-2xl font-black text-foreground tracking-tighter">{data.darkWebReport.compromisedAccounts}</p>
                <p class="text-foreground/50 text-[10px] mt-4 font-medium italic">Verified email/password leaks</p>
            </div>
        </div>

        <div class="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 relative overflow-hidden">
            <h3 class="text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span class="w-8 h-px bg-primary/30"></span>
                Recent Dark Web Leaks
            </h3>
            
            <div class="space-y-3">
                {#each data.darkWebReport.recentLeaks as leak}
                    <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="w-2 h-2 rounded-full {leak.severity === 'HIGH' ? 'bg-red-500' : leak.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'}"></div>
                            <div>
                                <p class="text-[11px] font-black text-foreground leading-tight">{leak.type}</p>
                                <p class="text-[9px] text-foreground/50 uppercase font-bold tracking-wider">{leak.source}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] font-black text-primary">{leak.date}</p>
                            <span class="text-[8px] px-2 py-0.5 rounded-full font-black uppercase {leak.severity === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-100' : leak.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}">
                                {leak.severity}
                            </span>
                        </div>
                    </div>
                {/each}
                {#if data.darkWebReport.recentLeaks.length === 0}
                    <div class="py-12 text-center bg-white/50 rounded-2xl border border-dashed border-gray-200">
                        <p class="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">No credential exposures detected in this period</p>
                    </div>
                {/if}
            </div>
        </div>

        <div class="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <h4 class="text-xs font-black text-primary uppercase tracking-wider mb-1">Analyst Note</h4>
                    <p class="text-[11px] text-foreground/70 leading-relaxed italic">
                        Our dark web monitoring system continuously scans encrypted networks, paste sites, and underground forums for mentions of your corporate domain and employee credentials. Any high-risk findings are immediately triaged by our SOC team.
                    </p>
                </div>
            </div>
        </div>
    </ReportSection>
</ReportPage>
