<script lang="ts">
    let { reportPeriodLabel }: { reportPeriodLabel: string } = $props();
</script>

<!-- Inline header change px-12 to px-[20mm] -->
<header class="bg-primary -mx-[20mm] -mt-[20mm] h-20 flex items-center px-12 relative overflow-hidden">
    <div class="flex items-center gap-6 z-10">
        <img src="/wirespeed.avif" alt="Wirespeed Logo" class="h-10 brightness-0 invert" />
        <div class="h-10 w-px bg-white/10"></div>
        <div>
            <p class="text-white/80 text-lg tracking-tight font-bold leading-none mb-1.5">{reportPeriodLabel}</p>
            <h1 class="text-white text-[9px] tracking-[0.5em] font-black uppercase leading-none">
                Security Operations Report
            </h1>
        </div>
    </div>
    
    <!-- Decorative elements -->
    <div class="absolute right-0 top-0 w-64 h-full bg-white/5 -skew-x-12 translate-x-32"></div>
    <div class="absolute right-0 top-0 w-32 h-full bg-white/5 -skew-x-12 translate-x-16"></div>
</header>
