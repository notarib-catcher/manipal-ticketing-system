<script>
  import { cscanstate } from "./cscan";
  import { CapacitorHttp } from '@capacitor/core';
  import { serverIP } from "./deets";
  import { init } from "svelte/internal";
  import App from "../App.svelte";

    const updateserverIP = async (value) => {
        srvip = value
    }

    serverIP.subscribe(updateserverIP)
    let srvip
    let error401 = false
    let error403 = false
    let validconfirm = false
    let resreason = ""

    let show = false
    let missingfieldsinvalid = false
    let scannedToken
    let JSONobj
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
        error401 = false
        error403 = false
        validconfirm = false
        // TODO: add event

        document.getElementById("output").innerText = "Querying..."
        try{
            let initres = await CapacitorHttp.get({
            url: srvip + `/verify?token=${scannedToken}`,
        }).catch(error => {
            document.getElementById("output").innerText = "error during HTTP request"
        })

        // @ts-ignore
        if(!initres.data){
            document.getElementById("output").innerText = "error during HTTP request"
        }

        document.getElementById("output").innerText = ""
        

        if(initres.status == 401){
            error401 = true
        }

        if(initres.status == 403){
            error403 = true
        }

        if(initres.status == 200){
            validconfirm = true
        }
        resreason = initres.data
        }
        catch(error){
            document.getElementById("output").innerText = "error during HTTP request"
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
        {#if error403}
            <div class=" w-screen bg-red-400">
            ERROR: 403<br>{resreason}
            </div>
        {/if}
        {#if error401}
            <div class=" w-screen bg-red-400">
            ERROR: 401<br>{resreason}
            </div>
        {/if}
        {#if validconfirm}
            <div class=" w-screen bg-green-400">
                {resreason}
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