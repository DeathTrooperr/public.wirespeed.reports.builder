<script lang="ts">
    import type { ReportData } from '$lib/scripts/types/report.types.js';
    import TitlePage from './reportPages/TitlePage.svelte';
    import ExecutiveSummaryPage from './reportPages/ExecutiveSummaryPage.svelte';
    import DetectionAnalysisPage from './reportPages/DetectionAnalysisPage.svelte';
    import ResponseActivityPage from './reportPages/ResponseActivityPage.svelte';
    import AssetIntelligencePage from './reportPages/AssetIntelligencePage.svelte';
    import DataIngestionPage from './reportPages/DataIngestionPage.svelte';

    let { data }: { data: ReportData } = $props();

    let caseChunks = $derived((() => {
        const chunks = [];
        const cases = data.escalatedCases;
        console.log(cases);
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
    let totalPages = $derived(5 + totalCasePages);
</script>

<div class="bg-gray-100 py-10 print:p-0 print:bg-white">
    <TitlePage {data} {totalPages} />
    
    <ExecutiveSummaryPage {data} {totalPages} />
    
    <DetectionAnalysisPage {data} {totalPages} />
    
    {#each caseChunks as chunk, i}
        <ResponseActivityPage 
            {data} 
            {chunk} 
            index={i} 
            {totalCasePages} 
            {totalPages}
        />
    {/each}

    <AssetIntelligencePage {data} pageNumber={4 + totalCasePages} {totalPages} />

    <DataIngestionPage {data} pageNumber={5 + totalCasePages} {totalPages} />
</div>
