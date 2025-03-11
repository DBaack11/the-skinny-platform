<script>
  import { Play } from "lucide-svelte";

  let { width = "w-[350px]", hoverEffect = false, position = "relative", customStyling = "" } = $props();
</script>

<div
  class="{position} flex flex-col justify-between {width} aspect-video bg-gray-200 rounded-xl p-2 {customStyling} {hoverEffect
    ? 'hover:translate-y-[-5px] hover:shadow-lg transition-all duration-200'
    : ''}"
>
  <div class="flex flex-col gap-2">
    <div class="w-[70%] h-[15px] bg-gray-300 animate-pulse rounded-sm"></div>
    <div class="w-[50%] h-[12px] bg-gray-300 animate-pulse rounded-sm"></div>
  </div>

  <Play class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-16 text-gray-300 animate-pulse fill-gray-300" />

  <div class="flex flex-row gap-2">
    <div class="w-[10%] h-[10px] bg-gray-300 animate-pulse rounded-sm"></div>
    <div class="w-[80%] h-[10px] bg-gray-300 animate-pulse rounded-sm"></div>
  </div>
</div>
