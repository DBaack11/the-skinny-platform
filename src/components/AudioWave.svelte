<div class="relative flex h-16 w-16 items-center justify-center overflow-hidden">
  <div class="absolute inset-x-0 h-8 w-full rounded-lg">
    <!-- Flex container to center the bars vertically -->
    <div class="flex h-full items-center justify-center">
      <div class="animate-wave mx-0.5 h-5 w-1 rounded bg-white" style="animation-delay: -0.4s"></div>
      <div class="animate-wave mx-0.5 h-6 w-1 rounded bg-white" style="animation-delay: -0.2s"></div>
      <div class="animate-wave mx-0.5 h-5 w-1 rounded bg-white"></div>
    </div>
  </div>
</div>

<style>
  @keyframes wave {
    0%,
    100% {
      transform: scaleY(0.5);
    }
    50% {
      transform: scaleY(1.1);
    }
  }

  /* Utility classes for the animation */
  .animate-wave {
    animation: wave 1s infinite ease-in-out;
  }
</style>
