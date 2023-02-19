<script>
  // @ts-ignore
  import Enroll from "./pages/Enroll.svelte";
  import TicketingPage from "./pages/TicketingPage.svelte";
  import { kioskTKN, kioskName, serverIP } from "./lib/deets";
  const linkercheck = async (value) => {
    if(value != null){
      linked = true
      token = value
    }
  }

  const namecheck = async (value) => {
    name = value
  }

  const ipcheck = async (value) => {
    ip = value
  }

  kioskTKN.subscribe(linkercheck)
  kioskName.subscribe(namecheck)
  serverIP.subscribe(ipcheck)

  let name = ""
  let linked = false
  let ip = ""
  let token = null
</script>


<div class="overscroll-none">
  <div id = "topbar-wrapper">
    <div class = " fixed top-0 z-10 h-16 bg-orange-900 shadow-2xl text-white font-semibold text-center w-screen pt-2">
       
      {#if linked}
      KIOSK - {name}<br>Bound to {ip.replace("://"," ")}
      {:else}
      MTK - ENROLLMENT PENDING
      {/if}
    </div>
  </div>
  <div id = "content-wrapper" class=" mt-16">
    {#if !linked}
      <Enroll />
    {:else}
    <TicketingPage />
      
      {/if}
  </div>
</div>