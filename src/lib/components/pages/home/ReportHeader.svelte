<script lang="ts">
    let { title }: { title: string } = $props();
</script>

<header class="bg-primary -mx-[20mm] -mt-[20mm] h-20 flex items-center px-10 relative overflow-hidden">
    <div class="flex items-center gap-4 z-10">
        <img src="/wirespeed.avif" alt="Wirespeed Logo" class="h-10" />
        <div class="h-8 w-px bg-white/20"></div>
        <div>
            <h1 class="text-white text-[10px] tracking-[0.4em] font-black uppercase opacity-60 leading-none mb-1">Security Report</h1>
            <p class="text-accent text-sm tracking-[0.2em] font-bold uppercase leading-none">{title}</p>
        </div>
    </div>
    
    <!-- Decorative elements -->
    <div class="absolute right-0 top-0 w-32 h-full bg-accent/10 -skew-x-12 translate-x-16"></div>
    <div class="absolute right-0 top-0 w-16 h-full bg-accent/20 -skew-x-12 translate-x-8"></div>
</header>
