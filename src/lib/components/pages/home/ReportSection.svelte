<script lang="ts">
    import type { Snippet } from 'svelte';
    let { title, children, isMain = false }: { title: string, children: Snippet, isMain?: boolean } = $props();
</script>

<section class="mt-10">
    {#if isMain}
        <div class="flex items-center gap-4 mb-8">
            <h2 class="text-primary text-3xl font-black tracking-tight">{title}</h2>
            <div class="h-px flex-grow bg-gray-100"></div>
        </div>
    {:else}
        <h2 class="text-primary text-sm font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
            <span class="w-1.5 h-5 bg-accent"></span>
            {title}
        </h2>
    {/if}
    {@render children()}
</section>
