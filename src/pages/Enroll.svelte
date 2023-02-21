<script>
    import { Preferences } from '@capacitor/preferences';
    import { CapacitorHttp } from '@capacitor/core';
    import { tempinputstore, kioskName, serverIP, kioskassignment, doassignmentagain, doenrollmentagain, notify } from "../lib/deets";
    import {kioskTKN} from "../lib/deets"
    var firstrun = true

    const enroll = async () => {
        console.log("IN")
        // @ts-ignore
        document.getElementById("enrollbtn").disabled = true
        // @ts-ignore
        tempinputstore.set([document.getElementById("IP").value,document.getElementById("CODE").value,null])
    }

    const recheckassign = async (value) => {
      if(!value){
        return
      }

      else {
        doassignmentagain.set(false)
      }

      let token =  (await Preferences.get({key:"token"})).value
      let sip = (await Preferences.get({key:"serverIP"})).value
      if(!sip || !token){
        return
      }

     

    
      let assignmentres = await CapacitorHttp.get({
              url:  sip + "/assignment?kioskToken=" + token,
              responseType : 'text'
            })

            if(assignmentres.status == 204){
              kioskassignment.set([null,null])
              Preferences.remove({key:"assignment"})
            }
            else if(assignmentres.status == 200){
              kioskassignment.set(assignmentres.data.split("+"))
              Preferences.set({key:"assignment",value:assignmentres.data})
            }
            else if(assignmentres.status == 404 || assignmentres.status == 401 || assignmentres.status == 409){
              notify.set("Kiosk enrollment invalidated")
              doenrollmentagain.set(true)
            }
    }

    doassignmentagain.subscribe(recheckassign)

    const checkstorage = async () => {

      let name = await Preferences.get({key:"name"})
      if(name.value){
        kioskName.set(name.value)
      }
      let sip = await Preferences.get({key:"serverIP"})
      if(sip.value){
        serverIP.set(sip.value)
      }

      let token = await Preferences.get({key:"token"})
      if(token.value){
        kioskTKN.set(token.value)
      }


      doassignmentagain.set(true)

      
    }

    const checkdeets = async (value) => {
      
      console.log("im IN")
      if(firstrun){
        firstrun = false
        return
      }
      document.getElementById("status").innerText = ""
      let ip = value[0]
      let prefix = ""
      if(!ip.startsWith("https")){
        prefix = "http://"
      }

      let code = value[1]
      // @ts-ignore
      let name = document.getElementById("name").value || "Kiosk - " + new Date().getTime()
      try{

          let resinit = await CapacitorHttp.get({
            url: prefix + ip,
            method: "GET",
            responseType: "text",
          }) 

          if(!resinit.data.toString().includes("MPTKT")){
            document.getElementById("status").innerText = "No running server found" + resinit.data
            return
          }
          else{
            await Preferences.set({key:"serverIP",value:prefix+ip})
            serverIP.set(prefix+ip)
          }

          let response = await CapacitorHttp.post({
            url: prefix + ip+ "/enroll",
            data: JSON.stringify({
              "code":code,
              "name": name
            }),
            method: "POST",
            responseType: "text",
            headers: {
              "content-type":"application/json"
          }
          })


          // @ts-ignore
          if(!response.data){
            document.getElementById("status").innerText += "ERR empty response"
          // @ts-ignore
            document.getElementById("enrollbtn").disabled = false
            return
          }
          // @ts-ignore
          
          // @ts-ignore

          if(response.status != 200){
            document.getElementById("status").innerText = "Failed with status " + response.status
            // @ts-ignore
            document.getElementById("enrollbtn").disabled = false
            return
          }
          else{
            await Preferences.set({key:"token",value:response.data})
            await Preferences.set({key:"name",value:name})
            kioskName.set(name)
            doassignmentagain.set(true)
            //setting the kiosk token will trigger the page change, do it last
            kioskTKN.set(response.data)
          }
        }
      catch(error){
        document.getElementById("status").innerText += "An error occured" + error.toString()
        // @ts-ignore
        document.getElementById("enrollbtn").disabled = false
        return 
      }
      


    }
    tempinputstore.subscribe(checkdeets)
    checkstorage()

</script>
<div class="self-ceter w-fit p-10 bg-slate-300 rounded-md m-auto mt-32 max-w-[100%] overflow-x-hidden overflow-y-hidden">
  <div id ="status" class=" w-screen bg-red-400 text-black">

  </div>
    <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
        <form>
    
    

          <div class="mb-6">
            <input
              type="text"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="IP"
              placeholder="IP"
            />
          </div>
          
          <div class="mb-6">
            <input
              type="text"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="name"
              placeholder="Kiosk name"
            />
          </div>

          <div class="mb-6">
            <input
              type="password"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="CODE"
              placeholder="Enrollment Code"
            />
          </div>
    
    
    
          <div class="text-center lg:text-left">
            <button
              id="enrollbtn"
              type="button"
              on:click={enroll}
              class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Enroll
            </button>
            
          </div>
        </form>
      </div>
</div>
