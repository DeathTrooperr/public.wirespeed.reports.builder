<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Monitor, Smartphone, Tablet } from 'lucide-svelte';

    let { message = "This application is optimized for desktop use. Please switch to a larger screen for the best experience." } = $props();
</script>

<div 
    class="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
    transition:fade
>
    <div class="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 text-center space-y-6">
        <div class="flex justify-center items-center gap-4 text-primary/20">
            <Smartphone class="w-8 h-8" />
            <Tablet class="w-12 h-12" />
            <Monitor class="w-16 h-16 text-primary" />
        </div>
        
        <div class="space-y-2">
            <h2 class="text-2xl font-black text-foreground tracking-tighter uppercase">Incompatible Device</h2>
            <div class="h-1 w-12 bg-primary/20 rounded-full mx-auto"></div>
        </div>

        <p class="text-foreground/60 text-sm leading-relaxed font-medium italic">
            {message}
        </p>

        <div class="pt-4">
            <button 
                onclick={() => window.location.reload()}
                class="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity"
            >
                Retry Connection
            </button>
        </div>
        
        <p class="text-[8px] text-foreground/30 uppercase font-black tracking-[0.2em]">Wirespeed Security Operations</p>
    </div>
</div>
