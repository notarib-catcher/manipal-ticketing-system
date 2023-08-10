<script>
    import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
    import { Dialog } from '@capacitor/dialog'
    import { cscanstate, unhidebtn } from './cscan';

const startScan = async () => {

  await BarcodeScanner.checkPermission({ force: true });

  let status = await BarcodeScanner.checkPermission({ force: false });
  if (status.restricted || status.unknown || status.denied) {
    await Dialog.alert({
      title:"Permission error",
      message: "Please allow app to use the camera. (If it's bugged try reopening the app)"
    })
    await BarcodeScanner.openAppSettings();
    return
  }
  document.getElementById("scannerprompt").hidden = false
  document.getElementById("scanbtn").hidden = true
  document.getElementById("stopscanbtn").hidden = false
  document.getElementById("torchbtn").hidden = false
  document.getElementById("output").hidden = true
  document.getElementById("CREDITS").hidden = true
  document.getElementById("scannerbars").hidden = false
  document.getElementById("scannerbox").hidden = false
  document.getElementById("misc-out").hidden = true
  unhidebtn.set(false)
  // Check camera permission
  // This is just a simple example, check out the better checks below
  

  // make background of WebView transparent
  // note: if you are using ionic this might not be enough, check below
  document.getElementById("scanbtn").innerText = "Start scan"
  cscanstate.set([null,null,"fail"])
  await BarcodeScanner.hideBackground();

  const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] }); // start scanning and wait for a result

  // if the result has content
  if (result.hasContent) {
    await BarcodeScanner.disableTorch()
    await BarcodeScanner.stopScan()
    await BarcodeScanner.showBackground()
    document.getElementById("misc-out").hidden = false
    document.getElementById("scannerprompt").hidden = true
    document.getElementById("scannerbars").hidden = true
    document.getElementById("scannerbox").hidden = true
    document.getElementById("scanbtn").hidden = false
    document.getElementById("CREDITS").hidden = false
    document.getElementById("output").hidden = false
    document.getElementById("stopscanbtn").hidden = true
    document.getElementById("torchbtn").hidden = true

    scanCompleted(result.content)
  }
};

const scanCompleted = async (encoded) => {
  let jwtsplit = encoded.split(".")
  if(jwtsplit.length != 2){
    //Invalid
  }

  let jsonstr = atob(jwtsplit[1])
  try{
    let jsonobj = JSON.parse(jsonstr)
    if(jsonobj._id){
      cscanstate.set([encoded,jsonobj,"found"])
    }
    else{
      throw "UnableToReadJSON"
    }
  }

  catch(error){

    cscanstate.set([null,null,"fail"])
    document.getElementById("scanbtn").innerText = "Invalid Scan"
    document.getElementById("output").innerText = error 
  }


}

const torchclick = async () => {
  BarcodeScanner.toggleTorch()
}


const stopScanClick = async() => {
  await BarcodeScanner.disableTorch()
  BarcodeScanner.stopScan()
  document.getElementById("misc-out").hidden = false
  document.getElementById("scanbtn").innerText = "Start scan (Previous scan aborted)"
  document.getElementById("scannerbars").hidden = true
  document.getElementById("scannerbox").hidden = true
  document.getElementById("scannerprompt").hidden = true
  document.getElementById("scanbtn").hidden = false
  document.getElementById("CREDITS").hidden = false
  document.getElementById("output").hidden = false
  document.getElementById("stopscanbtn").hidden = true
  document.getElementById("torchbtn").hidden = true
  
}

</script>

<div>
  <div id = "output" class=" relative bg-black bg-opacity-30 w-[90%] mt-3 rounded-lg mx-auto overflow-x-visible text-white text-light text-center"></div>
  <div id = "scannerbars" class="z-0 fixed top-0 left-0 h-screen w-screen overflow-hidden flex items-center justify-center" hidden>
    <div id="scannerbox" class=" w-[70%] h-[40%] border-4 screen-overlay border-blue-500 opacity-25" hidden/>
    <div  class=" fixed bottom-0 -translate-y-[100px] flex items-center justify-center w-screen text-white text-center font-semibold pointer-events-none" ><div hidden id="scannerprompt" class="  p-2 bg-black rounded-lg bg-opacity-20 font-light">Scan ticket QR<br><div class="text-xs font-semibold">If you face issues with autofocus, restart the scan.</div></div></div>
  </div>
  <div class="w-screen flex items-center justify-center">
    <button id = "scanbtn" class="h-10 rounded-lg z-20 active:bg-orange-400 transition-all duration-200 relative mt-3 w-[90%] disabled:bg-slate-400 bg-slate-800 text-white" on:click={startScan}>Start Scan</button>
  </div>
  <div class=" fixed left-0 bottom-0 flex flex-row w-screen items-center justify-center gap-3">
    <button id = "torchbtn" class="relative h-10 rounded-lg  z-20 bottom-10 transition-all duration-200 border-red-500 border-2  active:bg-orange-400 w-[40%] bg-slate-600 text-white" on:click={torchclick} hidden>Torch</button>
    <button id = "stopscanbtn" class="relative h-10 rounded-lg  z-20 bottom-10 transition-all duration-200 border-red-500 border-2  active:bg-orange-400 w-[40%]  bg-slate-600 text-white" on:click={stopScanClick} hidden>Abort</button>
  </div>
  

</div>

<style>
  @keyframes pan-overlay {
  from {
    background-position: 0% 0%;
  }
  
  to {
    background-position: 0% -100%;
  }
}
.screen-overlay {

  background-image: linear-gradient( rgba(11, 126, 137, 0.909), rgba(11, 126, 137, 0.384), transparent 3px, transparent 9px);
  background-size: 100% 9px;
  animation: pan-overlay 10s infinite linear;
}
</style>