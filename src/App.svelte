<script>
  // @ts-ignore
  import Enroll from "./pages/Enroll.svelte";
  import TicketingPage from "./pages/TicketingPage.svelte";

  let linked = false
  let ip = null
  let token = null
</script>


<div class="overscroll-none">
  <div id = "topbar-wrapper">
    <div class = " fixed top-0 z-10 h-10 bg-orange-900 shadow-2xl text-white font-semibold text-center w-screen pt-2">
      MTK -  
      {#if linked}
        LIVE
      {:else}
        ENROLLMENT PENDING
      {/if}
    </div>
  </div>
  <div id = "content-wrapper" class="mt-10">
    {#if linked}
      <Enroll />
    {:else}
      <TicketingPage />
    {/if}
  </div>
</div>