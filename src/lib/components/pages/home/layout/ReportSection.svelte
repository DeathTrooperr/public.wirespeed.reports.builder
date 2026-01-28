<script lang="ts">
    import type { Snippet } from 'svelte';
    import ReportHeader from './ReportHeader.svelte';
    import ReportFooter from './ReportFooter.svelte';

    let { 
        title, 
        children, 
        isMain = false, 
        mt = "mt-8",
        headerTitle,
        pageNumber,
        totalPages,
        reportType,
        showFooterDetails = false
    }: { 
        title?: string, 
        children: Snippet, 
        isMain?: boolean, 
        mt?: string,
        headerTitle?: string,
        pageNumber?: number,
        totalPages?: number,
        reportType?: string,
        showFooterDetails?: boolean
    } = $props();

    const isPage = $derived(headerTitle !== undefined || pageNumber !== undefined);
</script>

{#if isPage}
    <div class="a4-page page-break">
        <ReportHeader title={headerTitle || title || ''} {reportType} />
        
        <div class="flex-grow flex flex-col">
            <section class="{mt} flex-grow flex flex-col">
                {#if isMain && title}
                    <div class="flex flex-col gap-1 mb-6">
                        <h2 class="text-primary text-2xl font-black tracking-tighter uppercase">{title}</h2>
                        <div class="h-1 w-20 bg-primary/20 rounded-full"></div>
                    </div>
                {/if}
                {@render children()}
            </section>
        </div>

        <ReportFooter {pageNumber} {totalPages} showDetails={showFooterDetails} />
    </div>
{:else}
    <section class={mt}>
        {#if isMain && title}
            <div class="flex flex-col gap-1 mb-6">
                <h2 class="text-primary text-2xl font-black tracking-tighter uppercase">{title}</h2>
                <div class="h-1 w-20 bg-primary/20 rounded-full"></div>
            </div>
        {:else if title}
            <h3 class="text-foreground/40 text-[10px] font-black mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                <span class="w-8 h-px bg-primary/30"></span>
                {title}
            </h3>
        {/if}
        {@render children()}
    </section>
{/if}
