<script>
  import { ZoomPlugin } from 'capacitor-zoom-android'
  ZoomPlugin.disableZoom()
  import { cscanstate, cverifiedstate, unhidebtn } from "./cscan";
  import { CapacitorHttp } from '@capacitor/core';
  import { kioskassignment, serverIP, kioskTKN, doassignmentagain, notify } from "./deets";
  import { Dialog } from '@capacitor/dialog'  
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
    let kiosktoken = ""
    let okaytomark = false
    const onKioskTokenUpdate = async(value) => {
        kiosktoken = value
    }

    kioskTKN.subscribe(onKioskTokenUpdate)

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
                document.getElementById("output").innerText = "An error occured (ASYHTREQ)"
            })

            // @ts-ignore
            if(!initres.data){
                document.getElementById("output").innerText = "An error occured (HTREQ)"
            }

            document.getElementById("output").innerText = ""
            
            // @ts-ignore
            if(initres.status == 200){
                // @ts-ignore
                rescode = initres.status
                validconfirm = true
                // @ts-ignore
                if(initres.data.includes("staff")){
                    //disable btn
                    cverifiedstate.set([null,"staff"])
                    Dialog.alert({title:"Verified Staff Pass", message:"Allow them to proceed", buttonTitle:"Close"})
                }
                else{
                    cverifiedstate.set([scannedToken,"verified"])
                }
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
            Dialog.alert({message:"Please check your internet connection", title:"Error during server query", buttonTitle:"Close"})
            document.getElementById("output").innerHTML = "<div class = \"p-2\">Unable to connect! <br>[ERR_INET_DOWN]</div>"
            cverifiedstate.set([null,"fail"])
        }
        

    }

    cscanstate.subscribe(onScanStateUpdate)

    const onunhidebtnUpdate = async (value) => {
        okaytomark = value
    }

    unhidebtn.subscribe(onunhidebtnUpdate)

    const onVerifiedStateUpdate = async (value) => {
        unhidebtn.set(false)
        if(value[1] == "fail"){
            // @ts-ignore
            unhidebtn.set(false)
            document.getElementById("markbtn").innerText = "Attendance unavailable"
            return
        }
        if(value[1] == "staff"){
            unhidebtn.set(false)
            // @ts-ignore
            document.getElementById("markbtn").innerText = "STAFF"
            return
        }
        if(value[1] == "verified"){
            if(kassign.includes("!ALL!") || kassign == ""){
                unhidebtn.set(false)
                // @ts-ignore
                document.getElementById("markbtn").disabled = true
                // @ts-ignore
                document.getElementById("output").innerText = "Not assigned event"
                return
            }
            unhidebtn.set(true)
            // @ts-ignore
            document.getElementById("markbtn").hidden = false
            
            document.getElementById("markbtn").innerText = "Mark attendance"
            // @ts-ignore
            document.getElementById("markbtn").disabled = false
        }
    }

    cverifiedstate.subscribe(onVerifiedStateUpdate)

    const onMarkbtn = async () => {
        // @ts-ignore
        document.getElementById("markbtn").disabled = true
        document.getElementById("markbtn").innerText = "Marking..."

        try{
            if(kassign.includes("!ALL!") || kassign == ""){
                return
            }

            let markres = await CapacitorHttp.put({
                url: srvip + "/mark",
                data: JSON.stringify({
                    "kioskToken" : kiosktoken,
                    "event" : kassign,
                    "token" : scannedToken
                }),
                responseType: "text",
                method: 'PUT',
                headers: {
              "content-type":"application/json"
                }
            })

            if(markres.status == 200){
                // @ts-ignore
                document.getElementById("markbtn").innerText = "Done"
                // @ts-ignore
                document.getElementById("markbtn").disabled = true

            }
            else if(markres.status == 409){

                notify.set("Assignment incorrect. Rechecking.")
                
                doassignmentagain.set(true)

                document.getElementById("markbtn").innerText = "Assignment incorrect. Rechecking..."
                // @ts-ignore
                document.getElementById("markbtn").disabled = true
                return
            }
            else{
                // @ts-ignore
                document.getElementById("markbtn").disabled = true
                document.getElementById("markbtn").innerText = markres.data
                cverifiedstate.set([null,"fail"])
            }
        }

        catch(error){
            document.getElementById("markbtn").innerText = "Failed"
            // @ts-ignore
            document.getElementById("markbtn").ariaDisabled = "true"
        }

    }
</script>

<div id="scanned-output-wrapper">
    {#if show}
        {#if missingfieldsinvalid}
            <div class=" capitalize font-semibold w-screen bg-red-400 py-3">
            QR is invalid (Missing data) 
            </div>
        {/if}
        {#if errorinres}
            <div class=" capitalize font-semibold w-screen bg-red-400  text-center text-lg py-6 whitespace-pre-line">
            [{rescode}]: {resreason.toUpperCase().replace("REASON","\nREASON")}
            </div>
        {/if}
        {#if validconfirm}
            <div class=" capitalize font-semibold w-screen bg-green-400  text-center text-lg py-6">
            [{rescode}]: {resreason.toUpperCase()}
            </div>
        {/if}
        <div class=" w-screen flex items-center mt-2 justify-center left-0">
            <div class=" text-white font-light h-fit mt-2 w-fit p-2 bg-black bg-opacity-30 rounded-lg select-text ">
                <div class=" font-semibold">{JSONobj._id}</div>
                <ul>
                    <li>Name: {JSONobj.name}</li>
                    <li>Phone: {JSONobj.phone}</li>
                    <li>Type: {JSONobj.type?.replaceAll("!STAFF!","Staff member").replaceAll("!ALL!","Full access")}</li>
                </ul>
            </div>
        </div>
        
    {/if}
    {#if okaytomark}
        <div id = "btnwrap" class=" flex w-screen items-center justify-center">
            <button id = "markbtn" class="h-10 rounded-lg z-20 active:bg-orange-400 relative mt-3 w-[90%] disabled:bg-slate-400 bg-slate-800 text-white" on:click={onMarkbtn}>Mark Attendance</button>
        </div>
    {/if}
</div>