<script lang="ts">
    let { pageNumber, showDetails = false }: { pageNumber?: number, showDetails?: boolean } = $props();
</script>

<footer class="mt-auto pt-6 border-t border-gray-100 flex justify-between items-end text-gray-400 text-[8px] font-black uppercase tracking-[0.2em]">
    <div>
        <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 bg-primary"></span>
            <p class="text-primary font-black text-[10px]">Wirespeed by Coalition</p>
        </div>
        {#if showDetails}
            <p class="text-gray-400 text-[8px] lowercase font-medium tracking-widest opacity-80">
                <a href="https://wirespeed.co" class="hover:text-primary transition-colors">wirespeed.co</a> | <a href="mailto:support@wirespeed.co" class="hover:text-primary transition-colors">support@wirespeed.co</a>
            </p>
        {:else}
            <p class="opacity-60">Confidential & Proprietary</p>
        {/if}
    </div>
    <div class="text-right flex flex-col items-end gap-1">
        {#if pageNumber}
            <div class="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                <p class="text-primary font-black text-[10px]">Page {pageNumber}</p>
            </div>
        {:else if !showDetails}
            <p class="opacity-60">Confidential</p>
        {/if}
    </div>
</footer>
