<script>
  // @ts-ignore
  import Enroll from "./pages/Enroll.svelte";
  import TicketingPage from "./pages/TicketingPage.svelte";
  import { kioskTKN, kioskName, serverIP, kioskassignment, doassignmentagain, notify } from "./lib/deets";
  import Reenroll from "./lib/Reenroll.svelte";

  import { KeepAwake } from '@capacitor-community/keep-awake';

  const screenAwake = async () => {
    if(await KeepAwake.isSupported()){
      await KeepAwake.keepAwake()
    }
  }

  screenAwake()
  

  const linkercheck = async (value) => {
    if(value != null){
      linked = true
      token = value
    }
    else{
      linked = false
      token = null
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

    if(!value[1]){
      // @ts-ignore
      document.getElementById('scanbtn').disabled = true
      return
    }

    // @ts-ignore
    document.getElementById('scanbtn').disabled = false

  }

  const refreshassignbtn = async () => {
    // @ts-ignore
    document.getElementById("refbtn").disabled = true
    doassignmentagain.set(true)
    setTimeout(() => {
      // @ts-ignore
      document.getElementById("refbtn").disabled = false
    },2000)
  }

  const updateMiscOut = async (value) => {
    document.getElementById("misc-out").innerText = value
    setTimeout(() => {
      document.getElementById("misc-out").innerText = ""
    }, 3000);
  }

  notify.subscribe(updateMiscOut)

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
    <div class = " fixed top-0 z-10 h-24 bg-orange-900 shadow-2xl text-white font-semibold  w-screen pt-2 flex justify-center text-left items-end align-middle">
      {#if linked} 
      <div class=" fixed z-20 right-2 top-6">
        <button id="refbtn" on:click={refreshassignbtn} class=" w-fit rounded-md bg-red-800 disabled:bg-red-400 active:p-3 active:m-0 p-2 m-1 active:bg-orange-600 transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" height="20px" width="20px" version="1.1" id="Capa_1" viewBox="0 0 489.645 489.645" xml:space="preserve">
            <g>
              <path d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3   c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5   c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8   c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2   C414.856,432.511,548.256,314.811,460.656,132.911z"/>
            </g>
          </svg>
        </button>
       </div>
      {/if}
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
  <Reenroll />
  <br>
  <div id= "misc-out" class="w-screen -z-10  font-semibold text-center text-lg p-4 bg-orange-700 text-white capitalize"></div>
  <div id = "CREDITS" class=" w-screen fixed bottom-0 z-50 text-xs text-center">MTS/MT-KIOSK by Aaryan D</div>
</div>