<script>
  import { cscanstate } from "./cscan";
  import { CapacitorHttp } from '@capacitor/core';
  import { kioskassignment, serverIP } from "./deets";
  import { init } from "svelte/internal";
  import App from "../App.svelte";
  import { Preferences } from "@capacitor/preferences";
    let srvip = ""
    const updateserverIP = async (value) => {
        srvip = value
    }

    serverIP.subscribe(updateserverIP)
    let errorinres = false
    let validconfirm = false
    let resreason = ""
    let rescode = ""

    let show = false
    let missingfieldsinvalid = false
    let scannedToken
    let JSONobj
    let kassign = ""

    const onKioskAssignmentUpdate = async (value) => {
        kassign = value[1]
    }

    kioskassignment.subscribe(onKioskAssignmentUpdate)
    const onScanStateUpdate = async (value) => {
        document.getElementById("output").innerText = ""

        if(!(value[2] == "found")){
            missingfieldsinvalid = false
            show = false
            return;   
        }
        JSONobj = value[1]
        scannedToken = value[0]
        show = true
        if(!JSONobj.name || !JSONobj.type || !JSONobj.phone){
            missingfieldsinvalid = true
            show=false
            return
        }

        missingfieldsinvalid = false
        errorinres = false

        validconfirm = false
        // TODO: add event

        document.getElementById("output").innerText = "Querying..."
        try{
            let initres = await CapacitorHttp.get({
            url: srvip + `/verify?token=${scannedToken}` + ((kassign)?("&event=" + kassign):""),
            responseType: 'text'
        }).catch(error => {
            document.getElementById("output").innerText = "async error during HTTP request"
        })

        // @ts-ignore
        if(!initres.data){
            document.getElementById("output").innerText = "error during HTTP request"
        }

        document.getElementById("output").innerText = ""
        
        // @ts-ignore
        if(initres.status == 200){
            // @ts-ignore
            rescode = initres.status
            validconfirm = true
        }
        // @ts-ignore
        else{
            // @ts-ignore
            rescode = initres.status
            errorinres = true        
        }
        // @ts-ignore
        resreason = initres.data
        }
        catch(error){
            document.getElementById("output").innerText = "error during HTTP request" + error
        }
        

    }

    cscanstate.subscribe(onScanStateUpdate)
</script>

<div id="scanned-output-wrapper">
    {#if show}
        {#if missingfieldsinvalid}
            <div class=" w-screen bg-red-400">
            QR is invalid (Missing data) 
            </div>
        {/if}
        {#if errorinres}
            <div class=" w-screen bg-red-400">
            [{rescode}]: {resreason}
            </div>
        {/if}
        {#if validconfirm}
            <div class=" w-screen bg-green-400">
            [{rescode}]: {resreason}
            </div>
        {/if}
        <div>
            <b>{JSONobj._id}</b>
            <ul>
                <li>Name: {JSONobj.name}</li>
                <li>Phone: {JSONobj.phone}</li>
                <li>Type: {JSONobj.type}</li>
            </ul>
        </div>
    {/if}
</div>