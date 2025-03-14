<script>
  import SkeletonLoader from "./SkeletonLoader.svelte";
  import { SquareX, SquareArrowUpLeft, Play } from "lucide-svelte";
  import { PODCAST_NAMES } from "../utils";
  import AudioWave from "./AudioWave.svelte";
  import { onMount, onDestroy } from 'svelte';

  let currentPodcast = $state(PODCAST_NAMES.EXPANDERS);
  let currentEpisode = $state(null);
  let pictureInPicture = $state(false);

  const { podcasts } = $props();
  
  // Flag to track if we're in browser environment
  let isBrowser = false;
  
  // Only manipulate DOM after component is mounted in browser
  onMount(() => {
    isBrowser = true;
    return () => {
      // Cleanup on component destroy
      if (isBrowser) {
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
      }
    };
  });

  // Watch for changes to overlay state and update body scroll accordingly
  $effect(() => {
    if (!isBrowser) return;
    
    if (currentEpisode && !pictureInPicture) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    }
  });

  function handleEpisodeClick(episode) {
    if (episode.id !== currentEpisode?.id) {
      currentEpisode = episode;
    }
  }

  function handleCloseVideoPlayer(event) {
    event.stopPropagation();

    if (pictureInPicture) {
      currentEpisode = null;
      pictureInPicture = false;
    } else {
      pictureInPicture = true;
    }
  }

  function handleExpandVideoPlayer(event) {
    event.stopPropagation();
    pictureInPicture = false;
  }

  // Format date from "2024-10-30" to "Oct 30, 2024"
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Format duration from milliseconds to "44 min" or "1 hr 23 min"
  function formatDuration(ms) {
    if (!ms) return "0 min";

    const totalMinutes = Math.round(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} min`;
    } else {
      return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`;
    }
  }

  // Common classes for active states
  const activeClasses = {
    card: "translate-y-[-5px] shadow-[0_5px_20px_3px_rgba(0,0,0,0.3)]",
    gradient: "from-skinny-orange/50 h-full",
    text: "drop-shadow-[0_0_2px_rgba(0,0,0,1)]",
    playIcon: "opacity-100 scale-110",
    titleContainer: "translate-y-[-5px]",
  };

  // Common classes for hover states (with group-hover prefix)
  const hoverClasses = {
    card: "group-hover:translate-y-[-5px] group-hover:shadow-[0_5px_20px_3px_rgba(0,0,0,0.3)]",
    gradient: "group-hover:from-skinny-orange/50 group-hover:h-full",
    text: "group-hover:drop-shadow-[0_0_2px_rgba(0,0,0,1)]",
    playIcon: "group-hover:opacity-100 group-hover:scale-110",
    titleContainer: "group-hover:translate-y-[-5px]",
  };

  const videoPlayerClasses = {
    expanded: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] lg:w-[800px] aspect-video",
    pip: "bottom-5 right-5 w-[50%] md:w-[350px] aspect-video",
  };
</script>

<main class="mt-24 mb-60 justify-self-center flex flex-col items-center justify-center w-[90%]">
  <h1 class="text-center text-4xl md:text-5xl lg:text-6xl font-medium mb-24 underline decoration-skinny-orange">Our Podcasts</h1>

  <!-- PODCAST GALLERY PARENT CONTAINER -->
  <div class="flex flex-col items-center justify-center w-full">
    <!-- PODCAST TABS -->
    <div class="w-full relative">
      <div class="flex flex-row items-center justify-evenly cursor-pointer">
        <button
          data-tab
          class="flex-1 flex items-center justify-center hover:grayscale-0 hover:scale-105 transition-all duration-200 py-4 {currentPodcast === PODCAST_NAMES.EXPANDERS
            ? 'text-skinny-orange scale-105'
            : 'grayscale'}"
          onclick={() => (currentPodcast = PODCAST_NAMES.EXPANDERS)}
        >
          <img src="/expanders.png" class="w-[100px] md:w-[150px] lg:w-[200px] drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" alt="Expanders Podcast" />
        </button>
        <button
          data-tab
          class="flex-1 flex items-center justify-center hover:grayscale-0 hover:scale-105 transition-all duration-200 py-4 {currentPodcast === PODCAST_NAMES.SKINNY
            ? 'text-skinny-orange scale-105'
            : 'grayscale'}"
          onclick={() => (currentPodcast = PODCAST_NAMES.SKINNY)}
        >
          <img src="/skinny-on-entrepreneurship.png" class="w-[100px] md:w-[150px] lg:w-[200px]" alt="Skinny On Entrepreneurship" />
        </button>
      </div>

      <!-- TAB SELECTION INDICATOR -->
      <div
        class="w-[50%] absolute border-b-4 p-1 border-skinny-orange shadow-lg transition-all {currentPodcast === PODCAST_NAMES.SKINNY
          ? 'translate-x-full'
          : 'translate-x-0'} duration-300"
      ></div>
      <div class="w-full absolute border-b-4 p-1 border-gray-300 z-[-1] shadow-lg"></div>
    </div>

    <!-- Animation overlay -->
    {#if currentEpisode && !pictureInPicture}
      <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md border-none touch-none" onclick={(e) => handleCloseVideoPlayer(e)} role="none"></div>
    {/if}

    <!-- Video Player (moved outside sliding container) -->
    {#if currentEpisode}
      <div id="video-player" class={`fixed z-[60] ${pictureInPicture ? videoPlayerClasses.pip : videoPlayerClasses.expanded}`}>
        {#if pictureInPicture}
          <div class="absolute -inset-4 bg-gray-200/50 backdrop-blur-md rounded-xl shadow-lg z-[-1]"></div>
          <div class="absolute -top-10 right-0 flex items-center gap-4 bg-gray-200/50 backdrop-blur-md px-2 py-1 rounded-lg">
            <SquareArrowUpLeft size={30} class="text-gray-700 hover:text-skinny-orange transition-all duration-200 cursor-pointer" onclick={(e) => handleExpandVideoPlayer(e)} />
            <SquareX size={30} class="text-gray-700 hover:text-skinny-orange transition-all duration-200 cursor-pointer" onclick={(e) => handleCloseVideoPlayer(e)} />
          </div>
        {:else}
          <SquareX
            size={36}
            class="text-white hover:text-skinny-orange transition-all duration-200 absolute cursor-pointer -top-10 right-0"
            onclick={(e) => handleCloseVideoPlayer(e)}
          />
        {/if}

        <SkeletonLoader width="w-full" position="absolute" customStyling="z-[-1] opacity-50" />
        {@html currentEpisode.oembed.html || ""}

        {#if !pictureInPicture}
          <p
            class="relative -bottom-10 left-1/2 -translate-x-1/2 text-left text-white text-sm lg:text-xl font-light drop-shadow-[0_0_2px_rgba(0,0,0,1)] overflow-y-auto w-[90%] lg:w-[80vw] max-h-[60vh] lg:max-h-[400px]"
          >
            <span class="py-8 [&_a]:text-skinny-orange [&_a]:underline [&_a]:hover:text-orange-300 [&_a]:transition-colors">
              {@html currentEpisode.html_description}
            </span>
          </p>
        {/if}
      </div>
    {/if}

    <!-- PODCAST GALLERY VIEW -->
    {#snippet podcastGallery(episodes, podcastName)}
      <div id={`${podcastName}-container`} class="mt-16 w-full">
        <!-- PODCAST GALLERY VIEW -->
        <div id={`${podcastName}-gallery`} class="flex flex-row items-start justify-evenly flex-wrap gap-8">
          {#each episodes as episode}
            {@const isActive = currentEpisode === episode}

            <div class="group flex flex-col items-center justify-center">
              <button class="flex flex-col items-center justify-center cursor-pointer rounded-lg" onclick={() => handleEpisodeClick(episode)}>
                <!-- Episode Card (Video player is now outside) -->
                <div
                  class="relative rounded-xl w-[300px] sm:w-[350px] lg:w-[400px] aspect-video overflow-hidden transition-all duration-200 {isActive ? activeClasses.card : hoverClasses.card}"
                >
                  <!-- Gradient Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-b from-gray-800 from-10% to-transparent transition-all duration-200 h-1/2 {isActive
                      ? activeClasses.gradient
                      : hoverClasses.gradient}"
                  ></div>

                  <!-- Date and Duration -->
                  <div class="absolute inset-0 flex flex-row justify-between px-3 py-1">
                    <p class="text-white text-center text-md font-light transition-all duration-200 {isActive ? activeClasses.text : hoverClasses.text}">
                      {formatDate(episode.release_date)}
                    </p>
                    <p class="text-white text-center text-md font-light transition-all duration-200 {isActive ? activeClasses.text : hoverClasses.text}">
                      {formatDuration(episode.duration_ms)}
                    </p>
                  </div>

                  <!-- Play icon -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    {#if isActive}
                      <AudioWave />
                    {:else}
                      <Play size={48} fill="currentColor" class="text-white opacity-70 transition-all duration-200 {isActive ? activeClasses.playIcon : hoverClasses.playIcon}" />
                    {/if}
                  </div>

                  <img src={episode.oembed.thumbnail_url} alt={episode.name} class="w-full h-full object-cover" />
                </div>
              </button>

              <!-- Episode Title and Guest -->
              <div class="self-start pl-1 cursor-pointer transition-all duration-200 {isActive ? activeClasses.titleContainer : hoverClasses.titleContainer}">
                <p class="text-lg font-medium word-wrap max-w-[300px] sm:max-w-[350px] lg:max-w-[400px]">
                  {episode.name.split(" with ")[0]}
                </p>
                {#if episode.name.includes(" with ")}
                  <p class="text-sm text-gray-600 word-wrap max-w-[300px] sm:max-w-[350px] lg:max-w-[400px]">
                    {episode.name.split(" with ")[1]}
                  </p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/snippet}

    <div class="w-[100vw] overflow-hidden">
      <div class="podcast-slider flex transition-all duration-500 ease-in-out" style="transform: translateX({currentPodcast === PODCAST_NAMES.SKINNY ? '-50%' : '0%'});">
        {#each [PODCAST_NAMES.EXPANDERS, PODCAST_NAMES.SKINNY] as podcast}
          <div class="podcast-gallery w-1/2 flex-shrink-0 px-[5vw] flex justify-center">
            {@render podcastGallery(podcasts[podcast], podcast)}
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  .podcast-slider {
    width: 200%;
    min-height: 0;
  }

  .podcast-gallery {
    width: 50%;
    height: auto;
    transition: height 0.5s ease-in-out;
  }
</style>
