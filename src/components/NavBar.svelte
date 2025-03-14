<script>
  import { onMount } from 'svelte';
  import { Menu, X } from 'lucide-svelte';
  import TSPLogo from "../assets/TSPLogo.png";

  const links = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Skinny Books", path: "/skinny-books" },
    { label: "Collaborators", path: "/collaborators" },
    { label: "Podcasts", path: "/podcasts" },
  ];

  let isOpen = false;
  let currentPath = "";

  function toggleMenu() {
    isOpen = !isOpen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }

  // Helper function to check if a path is active
  function isPathActive(path) {
    if (path === "/") {
      // Home is only active when exactly at "/"
      return currentPath === "/";
    } else {
      // Other paths are active when they start with the path
      return currentPath.startsWith(path);
    }
  }

  onMount(() => {
    currentPath = window.location.pathname;
    window.addEventListener('popstate', () => {
      currentPath = window.location.pathname;
    });
    return () => {
      window.removeEventListener('popstate', () => {
        currentPath = window.location.pathname;
      });
    };
  });
</script>

<nav class={currentPath.startsWith("/about") ? "bg-skinny-tan" : ""}>
  <div class="flex flex-row justify-between items-center px-4 lg:px-12 pt-3 lg:pt-6">
    <a href="/"><img src={TSPLogo.src} class="w-[75px] sm:w-[100px] lg:w-[150px]" alt="The Skinny Platform" /></a>
    
    <!-- Mobile Menu Button -->
    <button 
      on:click={toggleMenu}
      class="sm:hidden p-2 hover:bg-black/5 rounded-lg transition-colors z-[51]"
      aria-label="Toggle menu"
    >
      {#if !isOpen}
        <Menu class="w-6 h-6" />
      {:else}
        <X class="w-6 h-6" />
      {/if}
    </button>

    <!-- Desktop Navigation -->
    <ul class="hidden sm:flex gap-3 md:gap-6">
      {#each links as { label, path }}
        {@const isActive = isPathActive(path)}
        <li class="relative">
          <a
            href={path}
            class={`block text-xs md:text-md lg:text-lg px-2 py-1 rounded-md
              ${isActive ? 'text-skinny-orange' : 'text-black hover:text-skinny-orange'}
              relative z-10
              transition-none
              ${isActive ? 'border-skinny-orange' : 'border-transparent hover:border-skinny-orange'} 
              border-[1.5px]`}
          >
            {label}
          </a>
        </li>
      {/each}
    </ul>

    <!-- Mobile Navigation -->
    <div 
      class="fixed inset-0 bg-gradient-to-b from-skinny-cream to-skinny-tan backdrop-blur-sm z-50 flex flex-col items-center justify-between py-16 transform transition-transform duration-300 sm:hidden"
      class:translate-x-full={!isOpen}
    >
      <!-- Logo in mobile menu -->
      <div class="w-full flex justify-center">
        <img src={TSPLogo.src} class="w-[120px]" alt="The Skinny Platform" />
      </div>
      
      <ul class="flex flex-col items-center gap-8">
        {#each links as { label, path }}
          {@const isActive = isPathActive(path)}
          <li class="relative">
            <a
              href={path}
              class={`block text-2xl px-4 py-2 rounded-md
                ${isActive ? 'text-skinny-orange' : 'text-black hover:text-skinny-orange'}
                relative z-10
                transition-none
                ${isActive ? 'border-skinny-orange' : 'border-transparent hover:border-skinny-orange'} 
                border-[1.5px]`}
              on:click={() => {
                if (isOpen) toggleMenu();
              }}
            >
              {label}
            </a>
          </li>
        {/each}
      </ul>
      
      <div class="invisible"><!-- Spacer to help with vertical centering --></div>
    </div>
  </div>
</nav> 