<script>
  import SkeletonLoader from "./SkeletonLoader.svelte";
  import { SquareX, SquareArrowUpLeft, Play } from "lucide-svelte";
  import Expanders from "../assets/expanders.png";

  let currentPodcast = $state("skinnyOnEntrepreneurship");
  let currentEpisode = $state(null);
  let pictureInPicture = $state(false);

  const { episodes } = $props();

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

  const guestNames = ["Emily", "Jason", "Kelsey", "Bill", "Rich", "Nolan", "Scott", "Jeffrey", "Ken"];

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
    expanded: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] aspect-video",
    pip: "bottom-5 right-5 w-[350px] aspect-video",
  };
</script>

<main class="mt-12 justify-self-center flex flex-col items-center justify-center w-[90%]">
  <!-- <h1 class="text-center text-4xl md:text-5xl lg:text-6xl font-medium mb-24 underline decoration-skinny-orange">Our Podcasts</h1> -->

  <!-- PODCAST GALLERY PARENT CONTAINER -->
  <div class="flex flex-col items-center justify-center w-full">
    <!-- PODCAST TABS -->
    <div class="w-full relative">
      <div class="flex flex-row items-center justify-evenly cursor-pointer">
        <button
          data-tab
          class="flex-1 flex items-center justify-center hover:grayscale-0 hover:scale-110 transition-all duration-200 py-4 {currentPodcast ===
          'skinnyOnEntrepreneurship'
            ? 'text-skinny-orange scale-110'
            : 'grayscale'}"
          onclick={() => (currentPodcast = "skinnyOnEntrepreneurship")}
          ><img src="src/assets/skinny-on-entrepreneurship.png" class="w-[30%]" alt="Skinny On Entrepreneurship" /></button
        >
        <button
          data-tab
          class="flex-1 flex items-center justify-center hover:grayscale-0 hover:scale-110 transition-all duration-200 py-4 {currentPodcast === 'expandersPodcast'
            ? 'text-skinny-orange scale-110'
            : 'grayscale'}"
          onclick={() => (currentPodcast = "expandersPodcast")}
          ><img src="src/assets/expanders.png" class="w-[30%] drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" alt="Expanders Podcast" /></button
        >
      </div>

      <!-- TAB SELECTION INDICATOR -->
      <div
        class="w-[50%] absolute border-b-4 p-1 border-skinny-orange shadow-lg transition-all {currentPodcast === 'expandersPodcast'
          ? 'translate-x-full'
          : 'translate-x-0'} duration-300"
      ></div>
      <div class="w-full absolute border-b-4 p-1 border-gray-300 z-[-1] shadow-lg"></div>
    </div>

    <!-- Animation overlay -->
    {#if currentEpisode && !pictureInPicture}
      <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md border-none" onclick={(e) => handleCloseVideoPlayer(e)} role="none"></div>
    {/if}

    <!-- PODCAST GALLERY VIEW -->
    <div class="mt-16 w-full">
      <!-- PODCAST GALLERY VIEW -->
      <div class="flex flex-row items-center justify-evenly flex-wrap gap-8">
        {#each episodes as episode}
          {@const splitTitle = episode.name.split(" - ")}
          {@const guestInFirstIndex = guestNames.some((name) => splitTitle[0].includes(name))}
          {@const guestName = guestInFirstIndex ? splitTitle[0] : splitTitle[1] || ""}
          {@const episodeTitle = guestInFirstIndex ? splitTitle[1] : splitTitle[0] || ""}
          {@const isActive = currentEpisode === episode}

          <div class="group flex flex-col items-center justify-center">
            <button class="flex flex-col items-center justify-center cursor-pointer rounded-lg" onclick={() => handleEpisodeClick(episode)}>
              {#if isActive}
                <div id="video-player" class={`fixed z-[60] ${pictureInPicture ? videoPlayerClasses.pip : videoPlayerClasses.expanded}`}>
                  {#if !pictureInPicture}
                    <h1 class="absolute -top-12 left-1 text-white text-4xl font-bold drop-shadow-[0_0_2px_rgba(0,0,0,1)]">{episodeTitle}</h1>
                  {/if}
                  <SquareX
                    size={pictureInPicture ? 30 : 36}
                    class="hover:text-skinny-orange transition-all duration-200 absolute {pictureInPicture ? 'text-black -top-8 right-0' : 'text-white -top-10 right-0'}"
                    onclick={(e) => handleCloseVideoPlayer(e)}
                  />
                  {#if pictureInPicture}
                    <SquareArrowUpLeft
                      size={30}
                      class="text-black hover:text-skinny-orange transition-all duration-200 absolute -top-8 right-10"
                      onclick={(e) => handleExpandVideoPlayer(e)}
                    />
                  {/if}

                  <SkeletonLoader width="w-full" position="absolute" customStyling="z-[-1] opacity-50" />
                  {@html currentEpisode.oembed.html || ""}

                  {#if !pictureInPicture}
                    <p class="mt-8 text-left text-white text-xl font-light drop-shadow-[0_0_2px_rgba(0,0,0,1)]">{episode.description}</p>
                  {/if}
                </div>
              {/if}

              <!-- Episode Card -->
              <div class="relative rounded-xl w-[350px] aspect-video overflow-hidden transition-all duration-200 {isActive ? activeClasses.card : hoverClasses.card}">
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
                  <Play size={48} fill="currentColor" class="text-white opacity-70 transition-all duration-200 {isActive ? activeClasses.playIcon : hoverClasses.playIcon}" />
                </div>

                <img src={episode.oembed.thumbnail_url} alt={episode.name} class="w-full h-full object-cover" />
              </div>
            </button>

            <!-- Episode Title and Guest -->
            <div class="self-start pl-1 cursor-pointer transition-all duration-200 {isActive ? activeClasses.titleContainer : hoverClasses.titleContainer}">
              <p class="text-md font-medium word-wrap max-w-[350px]">{episodeTitle}</p>
              <p class="text-sm font-light word-wrap max-w-[350px]">{guestName}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
