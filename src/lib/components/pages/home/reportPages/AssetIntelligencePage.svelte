<script lang="ts">
    import type { ReportData } from '$lib/scripts/types/report.types.js';
    import ReportSection from '../layout/ReportSection.svelte';

    let { data, pageNumber, totalPages }: { data: ReportData, pageNumber: number, totalPages: number } = $props();

    let deviceStats = $derived({
        windows: data.endpointsByOS.filter(o => o.os.toLowerCase().includes('windows')).reduce((acc, curr) => acc + Number(curr.count), 0),
        macos: data.endpointsByOS.filter(o => o.os.toLowerCase().includes('mac')).reduce((acc, curr) => acc + Number(curr.count), 0),
        linux: data.endpointsByOS.filter(o => o.os.toLowerCase().includes('linux')).reduce((acc, curr) => acc + Number(curr.count), 0),
        mobile: data.endpointsByOS.filter(o => 
            o.os.toLowerCase().includes('ios') || 
            o.os.toLowerCase().includes('android') || 
            o.os.toLowerCase().includes('mobile')
        ).reduce((acc, curr) => acc + Number(curr.count), 0)
    });
</script>

<ReportSection 
    title="Asset Analysis" 
    headerTitle="Asset Intelligence" 
    isMain={true} 
    {pageNumber} 
    {totalPages} 
    reportType={data.reportType}
>
    <!-- DEVICE OVERVIEW -->
    <div class="grid grid-cols-4 gap-6 mb-6">
        <div class="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-2xl"></div>
            <div class="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 3.449L9.75 2.1V11.25H0V3.449zm0 8.551h9.75v9.15L0 19.801V12zm10.5-9.9L24 0v11.25h-13.5V2.1zm0 18.9V12.75H24v11.25l-13.5-2.1z"/>
                </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Windows</p>
            <p class="text-2xl font-black text-primary tracking-tighter">{deviceStats.windows}</p>
        </div>

        <div class="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-2xl"></div>
            <div class="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 1.72-1.16 0-1.6-.71-2.94-.71-1.35 0-1.85.7-2.94.7-1.18 0-2.31-.78-3.32-1.72-2.06-1.92-3.63-5.41-3.63-8.49 0-3.04 1.57-4.66 3.09-4.66 1.15 0 2.14.71 2.85.71.7 0 1.84-.71 3.12-.71 1.05 0 2.45.42 3.32 1.43-3.05 1.79-2.56 5.86.53 7.08-.73 1.81-1.65 3.51-2.83 4.65zM12.03 5.43c-.11-2.67 2.18-4.88 4.79-5.18.23 2.86-2.58 5.3-4.79 5.18z"/>
                </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">macOS</p>
            <p class="text-2xl font-black text-primary tracking-tighter">{deviceStats.macos}</p>
        </div>

        <div class="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-2xl"></div>
            <div class="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.606 2.378c-.092-.016-.188-.024-.286-.024-2.518 0-1.85 2.668-1.89 3.557-.044.648-.177 1.16-.624 1.796-.527.625-1.267 1.636-1.618 2.688-.166.495-.245 1.002-.17 1.481a.252.252 0 00-.066.08c-.155.16-.268.357-.395.5-.118.117-.289.158-.475.236-.187.082-.392.16-.514.405a.796.796 0 00-.079.358c0 .118.016.239.033.32.035.237.07.433.024.577-.148.404-.166.681-.063.882.104.199.32.28.56.358.482.12 1.138.08 1.653.357.55.277 1.11.398 1.558.28.314-.069.578-.276.72-.563.349-.001.733-.16 1.346-.198.417-.035.938.158 1.536.118.015.08.038.118.068.198l.001.002c.234.463.664.673 1.124.637.46-.036.948-.32 1.344-.777.376-.455 1.003-.645 1.417-.894.207-.118.375-.279.387-.507.013-.239-.12-.483-.426-.82v-.057l-.002-.002c-.101-.12-.148-.318-.201-.55-.051-.239-.108-.468-.293-.623h-.001c-.036-.033-.074-.04-.112-.082a.213.213 0 00-.113-.038c.256-.76.156-1.517-.104-2.197-.317-.84-.872-1.572-1.296-2.073-.474-.599-.939-1.165-.93-2.004.017-1.28.141-3.65-2.111-3.653z"/>
                </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Linux</p>
            <p class="text-2xl font-black text-primary tracking-tighter">{deviceStats.linux}</p>
        </div>

        <div class="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-2xl"></div>
            <div class="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-3H7V5h10v12z"/>
                </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Mobile</p>
            <p class="text-2xl font-black text-primary tracking-tighter">{deviceStats.mobile}</p>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-8 mb-6">
        <!-- MOST ATTACKED ENDPOINTS -->
        <section>
            <h3 class="text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span class="w-8 h-px bg-primary/30"></span>
                <svg class="w-3.5 h-3.5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Most Attacked Endpoints
            </h3>
            <div class="space-y-2">
                {#each data.mostAttackedEndpoints as item}
                    <div class="group relative bg-white px-4 py-3 rounded-xl border border-gray-100 transition-all shadow-sm hover:shadow-md flex items-center gap-4 overflow-hidden">
                        <div class="absolute inset-y-0 left-0 w-1 bg-primary/20 group-hover:w-1.5 transition-all"></div>
                        <div class="relative z-10 flex-grow">
                            <div class="flex justify-between items-center mb-1.5">
                                <span class="text-[11px] font-black text-foreground/80 leading-tight truncate pr-4">{item.name}</span>
                                <span class="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/5 rounded-md border border-primary/10">{item.count}</span>
                            </div>
                            <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full bg-primary/30 rounded-full group-hover:bg-primary/50 transition-colors" style="width: {(item.count / (data.mostAttackedEndpoints[0]?.count || 1)) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                {/each}
                {#if data.mostAttackedEndpoints.length === 0}
                    <div class="py-12 text-center bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
                        <p class="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">No endpoint attacks detected</p>
                    </div>
                {/if}
            </div>
        </section>

        <!-- MOST ATTACKED IDENTITIES -->
        <section>
            <h3 class="text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span class="w-8 h-px bg-primary/30"></span>
                <svg class="w-3.5 h-3.5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Most Attacked Identities
            </h3>
            <div class="space-y-2">
                {#each data.mostAttackedIdentities as item}
                    <div class="group relative bg-white px-4 py-3 rounded-xl border border-gray-100 transition-all shadow-sm hover:shadow-md flex items-center gap-4 overflow-hidden">
                        <div class="absolute inset-y-0 left-0 w-1 bg-primary/20 group-hover:w-1.5 transition-all"></div>
                        <div class="relative z-10 flex-grow">
                            <div class="flex justify-between items-center mb-1.5">
                                <span class="text-[11px] font-black text-foreground/80 leading-tight truncate pr-4">{item.name}</span>
                                <span class="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/5 rounded-md border border-primary/10">{item.count}</span>
                            </div>
                            <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full bg-primary/30 rounded-full group-hover:bg-primary/50 transition-colors" style="width: {(item.count / (data.mostAttackedIdentities[0]?.count || 1)) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                {/each}
                {#if data.mostAttackedIdentities.length === 0}
                    <div class="py-12 text-center bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
                        <p class="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">No identity attacks detected</p>
                    </div>
                {/if}
            </div>
        </section>
    </div>

    <!-- SUSPICIOUS LOGIN LOCATIONS -->
    <section>
        <h3 class="text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span class="w-8 h-px bg-primary/30"></span>
            <svg class="w-3.5 h-3.5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Suspicious Login Locations
        </h3>
        <div class="grid grid-cols-2 gap-4">
            {#each data.suspiciousLoginLocations as item}
                <div class="group relative bg-white px-4 py-3 rounded-xl border border-gray-100 transition-all shadow-sm hover:shadow-md flex items-center gap-4 overflow-hidden">
                    <div class="absolute inset-y-0 left-0 w-1 bg-red-500/20 group-hover:w-1.5 transition-all"></div>
                    <div class="relative z-10 flex-grow">
                        <div class="flex justify-between items-center mb-1.5">
                            <span class="text-[11px] font-black text-foreground/80 leading-tight">{item.country}</span>
                            <span class="text-[10px] font-black text-red-600 px-2 py-0.5 bg-red-50 rounded-md border border-red-100">{item.count}</span>
                        </div>
                        <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-red-500/30 rounded-full group-hover:bg-red-500/50 transition-colors" style="width: {(item.count / (data.suspiciousLoginLocations[0]?.count || 1)) * 100}%"></div>
                        </div>
                    </div>
                </div>
            {/each}
            {#if data.suspiciousLoginLocations.length === 0}
                <div class="col-span-2 py-12 text-center bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
                    <p class="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">No suspicious login activity detected</p>
                </div>
            {/if}
        </div>
    </section>
</ReportSection>
