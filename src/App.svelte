<script>
  // @ts-ignore
  import Enroll from "./pages/Enroll.svelte";
  import TicketingPage from "./pages/TicketingPage.svelte";
  import { kioskTKN, kioskName, serverIP, kioskassignment } from "./lib/deets";
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

  const eventcheck = async (value) => {
    assignedeventname = value[0]
  }

  kioskTKN.subscribe(linkercheck)
  kioskName.subscribe(namecheck)
  serverIP.subscribe(ipcheck)
  kioskassignment.subscribe(eventcheck)


  let name = ""
  let linked = false
  let ip = ""
  let token = null
  let assignedeventname = ""
</script>


<div class="overscroll-none">
  <div id = "topbar-wrapper">
    <div class = " fixed top-0 z-10 h-24 bg-orange-900 shadow-2xl text-white font-semibold text-center w-screen pt-2">
       
      {#if linked}
      KIOSK - {name}<br>Bound to {ip.replace("://"," ")}<br>Assigned to {assignedeventname || "No event"}
      {:else}
      MTK - ENROLLMENT PENDING
      {/if}
    </div>
  </div>
  <div id = "content-wrapper" class=" mt-24">
    {#if !linked}
      <Enroll />
    {:else}
    <TicketingPage />
    {/if}
  </div>
  <br>
  <div id= "misc-out" class="w-screen -z-10">(Logs will be displayed below)<br></div>
</div>