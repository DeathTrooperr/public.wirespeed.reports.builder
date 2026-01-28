<script lang="ts">
    import type { ReportData } from '$lib/scripts/types/report.types.js';
    import ReportHeader from './ReportHeader.svelte';
    import ReportFooter from './ReportFooter.svelte';
    import ReportSection from './ReportSection.svelte';

    let { data }: { data: ReportData } = $props();

    const accentBg = 'bg-accent';

    let topIntegrations = $derived(
        [...data.eventsByIntegration]
            .sort((a, b) => b.countValue - a.countValue)
            .slice(0, 6)
    );

    let caseChunks = $derived((() => {
        const chunks = [];
        const cases = data.escalatedCases;
        if (cases.length === 0) return [[]];
        
        // First page can fit fewer cases because of Verdict Integrity
        const firstPageCount = 4;
        const otherPageCount = 6;
        
        chunks.push(cases.slice(0, firstPageCount));
        
        for (let i = firstPageCount; i < cases.length; i += otherPageCount) {
            chunks.push(cases.slice(i, i + otherPageCount));
        }
        
        return chunks;
    })());

    let totalCasePages = $derived(caseChunks.length);

    let deviceStats = $derived({
        windows: data.endpointsByOS.find(o => o.os.toLowerCase().includes('windows'))?.count || 0,
        macos: data.endpointsByOS.find(o => o.os.toLowerCase().includes('mac'))?.count || 0,
        linux: data.endpointsByOS.find(o => o.os.toLowerCase().includes('linux'))?.count || 0,
        mobile: data.endpointsByOS.filter(o => 
            o.os.toLowerCase().includes('ios') || 
            o.os.toLowerCase().includes('android') || 
            o.os.toLowerCase().includes('mobile')
        ).reduce((acc, curr) => acc + curr.count, 0)
    });
</script>

<style>
    @media print {
        .page-break {
            page-break-before: always;
        }
        @page {
            size: A4;
            margin: 0;
        }
    }
    .a4-page {
        width: 210mm;
        height: 297mm;
        padding: 20mm;
        margin: 10mm auto;
        background: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.05);
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    @media print {
        .a4-page {
            margin: 0;
            box-shadow: none;
            width: 210mm;
            height: 297mm;
        }
        :global(body) {
            background: white;
        }
    }
</style>

<div class="bg-gray-100 py-10 print:p-0 print:bg-white">
    <!-- PAGE 1: TITLE PAGE -->
    <div class="a4-page">
        <ReportHeader title="Security Report" />

        <div class="flex-grow flex flex-col justify-center">
            <div class="border-l-4 border-accent pl-10 py-16">
                <h2 class="text-primary text-7xl font-black mb-4 tracking-tighter uppercase">Security<br/>Operations<br/>Report</h2>
                <div class="flex items-center gap-3">
                    <span class="h-px w-12 bg-accent"></span>
                    <p class="text-secondary text-xl font-bold tracking-[0.3em] uppercase">Managed Detection & Response</p>
                </div>
            </div>

            <div class="mt-24 grid grid-cols-2 gap-16">
                <div>
                    <p class="text-gray-400 text-[9px] tracking-[0.5em] uppercase mb-4 font-black opacity-60">Prepared For</p>
                    <p class="text-5xl font-black text-primary uppercase tracking-tighter border-b-2 border-gray-100 pb-4">{data.companyName}</p>
                </div>

                <div class="flex flex-col justify-end">
                    <div class="grid grid-cols-2 gap-8">
                        <div>
                            <p class="text-gray-400 text-[9px] tracking-[0.5em] uppercase mb-3 font-black opacity-60">Period</p>
                            <p class="text-lg font-black text-gray-800 tracking-tight whitespace-nowrap">{data.reportPeriod}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-[9px] tracking-[0.5em] uppercase mb-3 font-black opacity-60">Status</p>
                            <p class="text-lg font-black text-emerald-600 tracking-tight">PROTECTED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ReportFooter showDetails={true} />
    </div>

    <!-- PAGE 2: EXECUTIVE SUMMARY & SERVICE SCOPE -->
    <div class="a4-page page-break">
        <ReportHeader title="Report Summary" />

        <ReportSection title="Executive Summary" isMain={true}>
            <p class="text-gray-700 leading-relaxed text-sm whitespace-pre-line bg-gray-50 p-6 rounded-lg border border-gray-100">
                {data.executiveSummary}
            </p>
        </ReportSection>

        <ReportSection title="Service Scope & Coverage">
            <div class="grid grid-cols-2 gap-6">
                <div class="p-6 bg-white border border-gray-200 rounded-xl shadow-sm relative overflow-hidden group hover:border-secondary transition-colors">
                    <div class="absolute top-0 left-0 w-1 h-full {accentBg}"></div>
                    <p class="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Billable Users</p>
                    <div class="flex items-baseline gap-2 my-1">
                        <p class="text-4xl font-black text-primary">{data.billableUsers}</p>
                        <span class="text-[10px] text-emerald-600 font-bold">Active</span>
                    </div>
                    <p class="text-gray-500 text-[9px] leading-tight">Verified identities under managed protection across all integrated directories.</p>
                </div>
                <div class="p-6 bg-white border border-gray-200 rounded-xl shadow-sm relative overflow-hidden group hover:border-secondary transition-colors">
                    <div class="absolute top-0 left-0 w-1 h-full {accentBg}"></div>
                    <p class="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Billable Endpoints</p>
                    <div class="flex items-baseline gap-2 my-1">
                        <p class="text-4xl font-black text-primary">{data.billableEndpoints}</p>
                        <span class="text-[10px] text-emerald-600 font-bold">Protected</span>
                    </div>
                    <p class="text-gray-500 text-[9px] leading-tight">Unique physical and virtual assets with active EDR agents and sensor telemetry.</p>
                </div>
            </div>
        </ReportSection>

        <ReportSection title="Performance Metrics">
            <div class="grid grid-cols-3 gap-6">
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                    <p class="text-gray-400 text-[9px] uppercase font-black mb-1">MTTR</p>
                    <p class="text-2xl font-black text-primary">{data.meanTimeMetrics.mttr}</p>
                    <p class="text-gray-500 text-[8px] mt-1 italic">Mean Time To Respond</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                    <p class="text-gray-400 text-[9px] uppercase font-black mb-1">MTTD</p>
                    <p class="text-2xl font-black text-primary">{data.meanTimeMetrics.mttd}</p>
                    <p class="text-gray-500 text-[8px] mt-1 italic">Mean Time To Detect</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                    <p class="text-gray-400 text-[9px] uppercase font-black mb-1">MTTV</p>
                    <p class="text-2xl font-black text-primary">{data.meanTimeMetrics.mttv}</p>
                    <p class="text-gray-500 text-[8px] mt-1 italic">Mean Time To Verdict</p>
                </div>
            </div>
        </ReportSection>

        <ReportSection title="Cases by Severity">
            <div class="grid grid-cols-5 gap-4">
                <div class="text-center p-4 rounded-lg bg-red-50 border border-red-100">
                    <p class="text-[9px] uppercase font-black text-red-600 mb-1">Critical</p>
                    <p class="text-3xl font-black text-red-700">{data.casesBySeverity.critical}</p>
                </div>
                <div class="text-center p-4 rounded-lg bg-orange-50 border border-orange-100">
                    <p class="text-[9px] uppercase font-black text-orange-600 mb-1">High</p>
                    <p class="text-3xl font-black text-orange-700">{data.casesBySeverity.high}</p>
                </div>
                <div class="text-center p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <p class="text-[9px] uppercase font-black text-amber-600 mb-1">Medium</p>
                    <p class="text-3xl font-black text-amber-700">{data.casesBySeverity.medium}</p>
                </div>
                <div class="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <p class="text-[9px] uppercase font-black text-blue-600 mb-1">Low</p>
                    <p class="text-3xl font-black text-blue-700">{data.casesBySeverity.low}</p>
                </div>
                <div class="text-center p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <p class="text-[9px] uppercase font-black text-gray-600 mb-1">Info</p>
                    <p class="text-3xl font-black text-gray-700">{data.casesBySeverity.informational}</p>
                </div>
            </div>
        </ReportSection>

        <ReportFooter pageNumber={2} />
    </div>

    <!-- PAGE 3: DETECTION OVERVIEW -->
    <div class="a4-page page-break">
        <ReportHeader title="Detection Analysis" />

        <section class="mt-12">
            <div class="flex items-center gap-4 mb-8">
                <h2 class="text-primary text-3xl font-black">Detection Overview</h2>
                <div class="h-px flex-grow bg-gray-100"></div>
            </div>
            
            <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                    <p class="text-secondary text-[10px] uppercase font-black tracking-widest mb-1">Total Detections</p>
                    <p class="text-4xl font-black text-primary">{data.detections.total}</p>
                    <p class="text-primary/60 text-[8px] mt-2 font-medium italic">Current reporting period</p>
                </div>
                <div class="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                    <p class="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Historic Avg</p>
                    <p class="text-4xl font-black text-primary">{data.detections.historic}</p>
                    <p class="text-gray-500 text-[8px] mt-2 font-medium italic">90-day rolling average</p>
                </div>
                <div class="p-6 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p class="text-emerald-600 text-[10px] uppercase font-black tracking-widest mb-1">Auto-Closed</p>
                    <p class="text-4xl font-black text-emerald-700">{data.detections.autoClosed}</p>
                    <p class="text-emerald-600/60 text-[8px] mt-2 font-medium italic">Mitigated via automated playbooks</p>
                </div>
            </div>

            <div class="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-primary relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 rounded-full -mr-16 -mt-16"></div>
                <h3 class="text-secondary text-sm font-black uppercase tracking-widest mb-8">Alert Processing Pipeline</h3>
                
                <div class="flex items-center justify-between gap-8 relative">
                    <!-- Tile-based Funnel Visualization -->
                    <div class="flex-[1.4] relative h-80 flex flex-col items-center">
                        <svg viewBox="0 0 260 280" class="w-full h-full">
                            <defs>
                                <filter id="tileShadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                                    <feOffset dx="0" dy="1" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.1" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            <!-- Ingested Tile -->
                            <path 
                                d="M 5,10 L 255,10 L 237,70 L 23,70 Z" 
                                class="fill-secondary/10 stroke-secondary/20"
                                stroke-width="1"
                                filter="url(#tileShadow)"
                            />
                            
                            <!-- Detections Tile -->
                            <path 
                                d="M 24.5,75 L 235.5,75 L 217.5,135 L 42.5,135 Z" 
                                class="fill-secondary/25 stroke-secondary/30"
                                stroke-width="1"
                                filter="url(#tileShadow)"
                            />
                            
                            <!-- Cases Tile -->
                            <path 
                                d="M 44,140 L 216,140 L 198,200 L 62,200 Z" 
                                class="fill-secondary/40 stroke-secondary/50"
                                stroke-width="1"
                                filter="url(#tileShadow)"
                            />
                            
                            <!-- Responded Tile -->
                            <path 
                                d="M 63.5,205 L 196.5,205 L 178.5,265 L 81.5,265 Z" 
                                class="fill-secondary stroke-secondary"
                                stroke-width="1"
                                filter="url(#tileShadow)"
                            />

                            <!-- Data Labels & Values -->
                            <!-- Ingested -->
                            <g transform="translate(130, 40)">
                                <text y="-10" text-anchor="middle" class="fill-secondary/70 text-[9px] font-bold uppercase tracking-[0.2em]">Ingested</text>
                                <text y="18" text-anchor="middle" class="fill-primary text-[24px] font-black tracking-tighter">{data.funnelData.total.toLocaleString()}</text>
                            </g>

                            <!-- Detections -->
                            <g transform="translate(130, 105)">
                                <text y="-10" text-anchor="middle" class="fill-secondary/70 text-[9px] font-bold uppercase tracking-[0.2em]">Detections</text>
                                <text y="18" text-anchor="middle" class="fill-primary text-[24px] font-black tracking-tighter">{data.funnelData.detections}</text>
                            </g>

                            <!-- Cases -->
                            <g transform="translate(130, 170)">
                                <text y="-10" text-anchor="middle" class="fill-secondary/70 text-[9px] font-bold uppercase tracking-[0.2em]">Cases</text>
                                <text y="18" text-anchor="middle" class="fill-primary text-[24px] font-black tracking-tighter">{data.funnelData.cases}</text>
                            </g>

                            <!-- Responded -->
                            <g transform="translate(130, 235)">
                                <text y="-10" text-anchor="middle" class="fill-white/80 text-[9px] font-bold uppercase tracking-[0.2em]">Responded</text>
                                <text y="18" text-anchor="middle" class="fill-white text-[24px] font-black tracking-tighter">{data.funnelData.responded}</text>
                            </g>
                        </svg>
                    </div>

                    <div class="flex-1 space-y-4">
                        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <p class="text-[10px] uppercase font-black text-secondary/60 mb-1 tracking-widest">Escalated</p>
                            <div class="flex items-baseline gap-3">
                                <p class="text-3xl font-black text-primary">{data.detections.escalated}</p>
                                <div class="flex items-center gap-1.5">
                                    <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                                    <p class="text-accent text-xs font-bold">{data.detections.escalatedPercent}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <p class="text-[10px] uppercase font-black text-secondary/60 mb-1 tracking-widest">Chat Ops</p>
                            <div class="flex items-baseline gap-3">
                                <p class="text-3xl font-black text-primary">{data.detections.chatOps}</p>
                                <p class="text-accent text-xs font-bold">{data.detections.chatOpsPercent}</p>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <p class="text-[10px] uppercase font-black text-secondary/60 mb-1 tracking-widest">Containment</p>
                            <div class="flex items-baseline gap-3">
                                <p class="text-3xl font-black text-primary">{data.detections.containment}</p>
                                <p class="text-accent text-xs font-bold">{data.detections.containmentPercent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="mt-8">
            <h2 class="text-primary text-xl font-black mb-6 uppercase tracking-wider flex items-center gap-3">
                <span class="w-2 h-6 {accentBg}"></span>
                Historical Simulation (Test Mode)
            </h2>
            <div class="grid grid-cols-3 gap-6">
                <div class="p-5 border border-amber-200 bg-amber-50/30 rounded-lg">
                    <p class="text-amber-700 text-[10px] uppercase font-black mb-1">Potential Escalation</p>
                    <p class="text-3xl font-black text-amber-800">{data.potentialActions.wouldEscalate}</p>
                </div>
                <div class="p-5 border border-amber-200 bg-amber-50/30 rounded-lg">
                    <p class="text-amber-700 text-[10px] uppercase font-black mb-1">Potential Chat Ops</p>
                    <p class="text-3xl font-black text-amber-800">{data.potentialActions.wouldChatOps}</p>
                </div>
                <div class="p-5 border border-amber-200 bg-amber-50/30 rounded-lg">
                    <p class="text-amber-700 text-[10px] uppercase font-black mb-1">Potential Contain</p>
                    <p class="text-3xl font-black text-amber-800">{data.potentialActions.wouldContain}</p>
                </div>
            </div>
            <p class="text-[9px] text-gray-400 mt-4 italic">Note: These metrics simulate the impact of current detection rules against historical data sets.</p>
        </section>

        <ReportFooter pageNumber={3} />
    </div>

    <!-- PAGE 4: VERDICT & ACCURACY + ESCALATIONS -->
    {#each caseChunks as chunk, i}
    <div class="a4-page page-break">
        <ReportHeader title="Response Activity" />

        {#if i === 0}
        <section class="mt-8">
            <div class="flex items-center gap-4 mb-6">
                <h2 class="text-primary text-2xl font-black">Verdict Integrity</h2>
                <div class="h-px flex-grow bg-gray-100"></div>
            </div>
            
            <div class="grid grid-cols-3 gap-6 mb-8">
                <!-- Confirmation Rate Chart -->
                <div class="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-2">
                        <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    </div>
                    <div class="relative w-24 h-24">
                        <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#fee2e2"
                                stroke-width="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#dc2626"
                                stroke-width="3"
                                stroke-dasharray="{Math.min(100, (data.verdictAccuracy.confirmedMalicious / (data.verdictAccuracy.verdictedMalicious || 1)) * 100)}, 100"
                            />
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-xl font-black text-primary">{Math.round((data.verdictAccuracy.confirmedMalicious / (data.verdictAccuracy.verdictedMalicious || 1)) * 100)}%</span>
                        </div>
                    </div>
                    <p class="text-[9px] font-black text-gray-400 uppercase mt-4 tracking-widest text-center">Confirmation Rate</p>
                </div>

                <div class="col-span-2 grid grid-cols-1 gap-4">
                    <div class="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center relative overflow-hidden">
                        <div class="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                            <svg class="w-24 h-24 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-emerald-700 text-[10px] uppercase font-black mb-1 tracking-widest">True Positives</p>
                            <p class="text-4xl font-black text-emerald-800">{data.verdictAccuracy.truePositives}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-emerald-600 font-black text-2xl">{data.verdictAccuracy.truePositivesPercent}</p>
                            <div class="w-32 bg-emerald-200 h-2 rounded-full mt-2 overflow-hidden">
                                <div class="bg-emerald-600 h-full" style="width: {data.verdictAccuracy.truePositivesPercent}"></div>
                            </div>
                        </div>
                    </div>
                    <div class="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex justify-between items-center relative overflow-hidden">
                        <div class="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                            <svg class="w-24 h-24 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-amber-700 text-[10px] uppercase font-black mb-1 tracking-widest">False Positives</p>
                            <p class="text-4xl font-black text-amber-800">{data.verdictAccuracy.falsePositives}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-amber-600 font-black text-2xl">{data.verdictAccuracy.falsePositivesPercent}</p>
                            <div class="w-32 bg-amber-200 h-2 rounded-full mt-2 overflow-hidden">
                                <div class="bg-amber-600 h-full" style="width: {data.verdictAccuracy.falsePositivesPercent}"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/if}

        <section class={i === 0 ? "mt-4" : "mt-8"}>
            <div class="flex items-center gap-4 mb-6">
                <h2 class="text-primary text-2xl font-black">
                    SOC Escalations and Response Activity 
                    {#if i > 0}
                        <span class="text-gray-400 ml-2">(Continued)</span>
                    {/if}
                </h2>
                <div class="h-px flex-grow bg-gray-100"></div>
            </div>

            <div class="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="py-3 px-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] w-20">Ref ID</th>
                            <th class="py-3 px-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] w-48">Incident Detail</th>
                            <th class="py-3 px-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] w-28">Severity</th>
                            <th class="py-3 px-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Summary</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        {#each chunk as item}
                            <tr class="hover:bg-gray-50/50 transition-colors align-top">
                                <td class="py-3 px-4">
                                    <a 
                                        href="https://app.wirespeed.co/incidents/{item.id}" 
                                        target="_blank" 
                                        class="text-[10px] font-black text-secondary hover:text-accent transition-colors no-underline"
                                    >
                                        #{item.sid}
                                    </a>
                                </td>
                                <td class="py-3 px-4">
                                    <p class="text-[11px] font-black text-primary leading-tight">{item.title}</p>
                                    <p class="text-[8px] text-gray-400 mt-1 font-bold">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </td>
                                <td class="py-3 px-4">
                                    <span class="px-2 py-0.5 rounded-full text-[8px] font-black uppercase border {
                                        item.severity === 'CRITICAL' ? 'text-red-600 bg-red-50 border-red-100' :
                                        item.severity === 'HIGH' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                                        item.severity === 'MEDIUM' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                        'text-blue-600 bg-blue-50 border-blue-100'
                                    }">
                                        {item.severity}
                                    </span>
                                </td>
                                <td class="py-3 px-4">
                                    <div class="flex flex-col gap-2">
                                        <p class="text-[10px] text-gray-600 leading-relaxed italic">
                                            {item.response.length > 160 ? item.response.slice(0, 160) + '...' : item.response}
                                        </p>
                                        {#if item.response.length > 160}
                                            <a 
                                                href="https://app.wirespeed.co/incidents/{item.id}" 
                                                target="_blank"
                                                class="text-[9px] font-black text-secondary hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-wider no-underline print:hidden"
                                            >
                                                View Full Incident
                                                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        {/if}
                                    </div>
                                </td>
                            </tr>
                        {/each}
                        {#if data.escalatedCases.length === 0}
                            <tr>
                                <td colspan="4" class="py-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">
                                    No escalated incidents recorded in this period
                                </td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>

            {#if i === totalCasePages - 1}
            <div class="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p class="text-[9px] text-gray-500 leading-relaxed">
                    <span class="font-black text-secondary uppercase tracking-widest mr-2">SOC Quality Assurance:</span>
                    All verdicts undergo a secondary review process to ensure precision in detection logic and minimize organizational friction. Our current confirmation rate reflects Wirespeed's commitment to high-fidelity alerting and continuous improvement of automated response playbooks.
                </p>
            </div>
            {/if}
        </section>

        <ReportFooter pageNumber={4 + i} />
    </div>
    {/each}

    <!-- SECTION: ASSET INTELLIGENCE -->
    <div class="a4-page page-break">
        <ReportHeader title="Asset Intelligence" />

        <section class="mt-12 flex-grow">
            <div class="flex items-center gap-4 mb-8">
                <h2 class="text-primary text-3xl font-black">Asset Analysis</h2>
                <div class="h-px flex-grow bg-gray-100"></div>
            </div>

            <!-- DEVICE OVERVIEW -->
            <div class="grid grid-cols-4 gap-4 mb-12">
                <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center group hover:border-secondary transition-colors">
                    <div class="w-12 h-12 mx-auto mb-4 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:text-secondary transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M0 3.449L9.75 2.1L9.751 11.25H0V3.449zm0 8.551h9.751v9.15L0 19.801V12zm10.551-10.197L24 0v11.25h-13.449V1.803zM24 12v11.25l-13.449-1.95V12H24z"/>
                        </svg>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Windows</p>
                    <p class="text-2xl font-black text-primary">{deviceStats.windows}</p>
                </div>

                <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center group hover:border-secondary transition-colors">
                    <div class="w-12 h-12 mx-auto mb-4 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:text-secondary transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.96 0-2.04-.54-3.12-.54-1.09 0-2.02.54-3.04.54-1.94 0-4.07-1.33-5.11-3.21-1.37-2.45-.36-6.11 2.06-9.52 1.09-1.54 2.65-2.52 4.31-2.52 1.25 0 2.33.68 3.19.68.82 0 2.1-.81 3.59-.81 1.63 0 2.96.82 3.84 2.09-3.25 1.91-2.73 6.13.51 7.42-1.33 1.99-3.06 3.87-5.04 3.87h-.19zm-3.26-16.7c.07-2.02 1.69-3.58 3.52-3.58.11 0 .22 0 .31.01-.07 2.02-1.69 3.58-3.52 3.58-.1 0-.21-.01-.31-.01z"/>
                        </svg>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">macOS</p>
                    <p class="text-2xl font-black text-primary">{deviceStats.macos}</p>
                </div>

                <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center group hover:border-secondary transition-colors">
                    <div class="w-12 h-12 mx-auto mb-4 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:text-secondary transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2C12,2 10,3 10,5C10,7 12,8 12,8C12,8 14,7 14,5C14,3 12,2 12,2M12,9C9,9 7,11 7,14C7,17 9,19 12,19C15,19 17,17 17,14C17,11 15,9 12,9M12,22C8,22 5,20 5,16C5,14 6,12 8,10L12,14L16,10C18,12 19,14 19,16C19,20 16,22 12,22Z" />
                        </svg>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Linux</p>
                    <p class="text-2xl font-black text-primary">{deviceStats.linux}</p>
                </div>

                <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center group hover:border-secondary transition-colors">
                    <div class="w-12 h-12 mx-auto mb-4 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:text-secondary transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
                        </svg>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Mobile</p>
                    <p class="text-2xl font-black text-primary">{deviceStats.mobile}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-12 mb-12">
                <!-- MOST ATTACKED ENDPOINTS -->
                <section>
                    <h2 class="text-primary text-sm font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                        <span class="w-1.5 h-5 bg-accent"></span>
                        Most Attacked Endpoints
                    </h2>
                    <div class="space-y-2">
                        {#each data.mostAttackedEndpoints as item}
                            <div class="group relative bg-gray-50 hover:bg-white p-3 rounded-lg border border-gray-100 hover:border-secondary transition-all shadow-sm">
                                <div class="flex justify-between items-center relative z-10">
                                    <span class="text-[10px] font-bold text-gray-700 leading-tight pr-4">{item.name}</span>
                                    <span class="text-xs font-black text-primary bg-white px-2 py-1 rounded shadow-sm group-hover:bg-secondary group-hover:text-white transition-colors">{item.count}</span>
                                </div>
                                <div class="absolute bottom-0 left-0 h-1 bg-primary/10 rounded-b-lg" style="width: {(item.count / (data.mostAttackedEndpoints[0]?.count || 1)) * 100}%"></div>
                            </div>
                        {/each}
                    </div>
                </section>

                <!-- MOST ATTACKED IDENTITIES -->
                <section>
                    <h2 class="text-primary text-sm font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                        <span class="w-1.5 h-5 bg-accent"></span>
                        Most Attacked Identities
                    </h2>
                    <div class="space-y-2">
                        {#each data.mostAttackedIdentities as item}
                            <div class="group relative bg-gray-50 hover:bg-white p-3 rounded-lg border border-gray-100 hover:border-secondary transition-all shadow-sm">
                                <div class="flex justify-between items-center relative z-10">
                                    <span class="text-[10px] font-bold text-gray-700 leading-tight pr-4">{item.name}</span>
                                    <span class="text-xs font-black text-primary bg-white px-2 py-1 rounded shadow-sm group-hover:bg-secondary group-hover:text-white transition-colors">{item.count}</span>
                                </div>
                                <div class="absolute bottom-0 left-0 h-1 bg-secondary/10 rounded-b-lg" style="width: {(item.count / (data.mostAttackedIdentities[0]?.count || 1)) * 100}%"></div>
                            </div>
                        {/each}
                    </div>
                </section>
            </div>

            <!-- SUSPICIOUS LOGIN LOCATIONS -->
            <section>
                <h2 class="text-primary text-sm font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                    <span class="w-1.5 h-5 bg-accent"></span>
                    Suspicious Login Locations
                </h2>
                <div class="grid grid-cols-2 gap-4">
                    {#each data.suspiciousLoginLocations as item}
                        <div class="group relative bg-gray-50 hover:bg-white p-3 rounded-lg border border-gray-100 hover:border-secondary transition-all shadow-sm">
                            <div class="flex justify-between items-center relative z-10">
                                <span class="text-xs font-bold text-gray-700">{item.country}</span>
                                <span class="text-xs font-black text-primary bg-white px-2 py-1 rounded shadow-sm group-hover:bg-secondary group-hover:text-white transition-colors">{item.count}</span>
                            </div>
                            {#if data.suspiciousLoginLocations[0]?.count > 0}
                                <div class="absolute bottom-0 left-0 h-1 bg-red-500/10 rounded-b-lg" style="width: {(item.count / data.suspiciousLoginLocations[0].count) * 100}%"></div>
                            {/if}
                        </div>
                    {/each}
                    {#if data.suspiciousLoginLocations.length === 0}
                         <div class="col-span-2 py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">No suspicious login activity detected</p>
                        </div>
                    {/if}
                </div>
            </section>
        </section>

        <ReportFooter pageNumber={4 + totalCasePages} />
    </div>

    <!-- SECTION: INTEGRATIONS -->
    <div class="a4-page page-break">
        <ReportHeader title="Data Ingestion" />

        <section class="mt-12 flex-grow flex flex-col">
            <div class="flex items-center gap-4 mb-8">
                <h2 class="text-primary text-3xl font-black">Ingestion Architecture</h2>
                <div class="h-px flex-grow bg-gray-100"></div>
            </div>

            <!-- BAR GRAPH -->
            <div class="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-sm relative overflow-hidden">
                <div class="flex items-end justify-between gap-2 h-24 mb-6">
                    {#each topIntegrations as item}
                        <div class="flex-1 flex flex-col items-center group h-full justify-end">
                            <div class="w-full relative flex flex-col justify-end h-full">
                                <div 
                                    class="bg-secondary w-full rounded-sm transition-all duration-1000 relative" 
                                    style="height: {(item.countValue / (topIntegrations[0]?.countValue || 1)) * 100}%"
                                >
                                    <div class="absolute -top-5 left-0 w-full text-center">
                                        <span class="text-[8px] font-black text-secondary">{item.count}</span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-[8px] font-black text-primary mt-3 truncate w-full text-center uppercase tracking-tighter">{item.name}</p>
                        </div>
                    {/each}
                </div>
                
                <div class="flex justify-between items-center border-t border-gray-100 pt-5">
                    <div>
                        <h3 class="text-primary text-[10px] font-black uppercase tracking-widest">Ingestion Distribution</h3>
                        <p class="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Primary telemetry contributors by event volume</p>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-black text-primary tracking-tighter">{data.funnelData.total.toLocaleString()}</p>
                        <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Events</p>
                    </div>
                </div>
            </div>

            <!-- SOURCE INVENTORY -->
            <div class="flex-grow">
                 <div class="flex items-center justify-between px-2 mb-3">
                    <h3 class="text-primary text-[10px] font-black uppercase tracking-widest">Source Inventory</h3>
                    <span class="text-[9px] font-bold text-gray-400 uppercase">{data.eventsByIntegration.length} Active Sources</span>
                 </div>
                 
                 <div class="grid grid-cols-2 gap-x-10 gap-y-0.5">
                    {#each data.eventsByIntegration as item}
                        <div class="group flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                            <div class="flex-grow min-w-0">
                                <div class="flex justify-between items-baseline mb-0.5">
                                    <span class="text-[10px] font-black text-primary truncate pr-2">{item.name}</span>
                                    <span class="text-[9px] font-black text-secondary whitespace-nowrap">{item.count}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-grow h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            class="h-full rounded-full opacity-80 transition-all duration-700 bg-secondary" 
                                            style="width: {(item.countValue / data.funnelData.total) * 100}%"
                                        ></div>
                                    </div>
                                    <span class="text-[7px] text-gray-400 font-bold uppercase whitespace-nowrap w-12 text-right">{item.processed}</span>
                                </div>
                            </div>
                        </div>
                    {/each}
                 </div>
            </div>

            <!-- TELEMETRY NORMALIZATION -->
            <div class="mt-auto bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                <h3 class="text-secondary text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                     Telemetry Normalization
                </h3>
                <p class="text-[11px] text-gray-600 leading-relaxed italic">
                    Wirespeed normalizes diverse telemetry from multiple security vendors into the Open Cybersecurity Schema Framework (OCSF). This unified data model allows our detection engine to correlate activity across endpoints, identities, and network layers with extreme precision, regardless of the underlying source.
                </p>
            </div>
        </section>

        <ReportFooter pageNumber={5 + totalCasePages} />
    </div>
</div>
