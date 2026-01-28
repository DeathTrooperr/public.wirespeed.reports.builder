<script lang="ts">
    import type { ReportData } from '$lib/scripts/types/report.types.js';
    import ReportSection from '../layout/ReportSection.svelte';

    let { data, totalPages }: { data: ReportData, totalPages: number } = $props();
</script>

<ReportSection 
    headerTitle="Security Operations Report" 
    {totalPages} 
    showFooterDetails={true} 
    reportType={data.reportType}
    mt="mt-0"
>
    <div class="flex-grow flex flex-col justify-center px-12">
        <div class="relative">
            <div class="absolute -left-12 top-0 bottom-0 w-2 bg-primary rounded-full"></div>
            <h2 class="text-foreground text-6xl font-black mb-6 tracking-tighter uppercase leading-[0.85]">
                Security<br/>
                <span class="text-primary">Operations</span><br/>
                Report
            </h2>
            <div class="flex items-center gap-4">
                <div class="h-px w-16 bg-primary/20"></div>
                <p class="text-foreground/60 text-xl font-bold tracking-[0.2em] uppercase">Managed Detection & Response</p>
            </div>
        </div>

        <div class="mt-32 grid grid-cols-2 gap-24">
            <div>
                <p class="text-primary text-[10px] tracking-[0.4em] uppercase mb-4 font-black">Prepared For</p>
                <p class="text-3xl font-black text-foreground uppercase tracking-tighter">{data.companyName}</p>
                <div class="h-1 w-12 bg-primary mt-4"></div>
            </div>

            <div class="flex flex-col justify-end border-l border-gray-100 pl-12">
                <div class="space-y-8">
                    <div>
                        <p class="text-foreground/40 text-[9px] tracking-[0.4em] uppercase mb-2 font-black">Reporting Period</p>
                        <p class="text-2xl font-black text-foreground tracking-tight">{data.reportPeriod}</p>
                    </div>
                    <div>
                        <p class="text-foreground/40 text-[9px] tracking-[0.4em] uppercase mb-2 font-black">Platform Status</p>
                        <div class="flex items-center gap-2">
                            <p class="text-2xl font-black text-emerald-600 tracking-tight uppercase">Protected</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</ReportSection>
