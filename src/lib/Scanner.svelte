<script>
    import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
    import { Dialog } from '@capacitor/dialog'
    import { cscanstate } from './cscan';

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
  document.getElementById("scanbtn").hidden = true
  document.getElementById("stopscanbtn").hidden = false
  document.getElementById("output").hidden = true
  document.getElementById("scannerbars").hidden = false
  document.getElementById("misc-out").hidden = true

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
    await BarcodeScanner.stopScan()
    await BarcodeScanner.showBackground()
    document.getElementById("misc-out").hidden = false

    document.getElementById("scannerbars").hidden = true

    document.getElementById("scanbtn").hidden = false
    document.getElementById("output").hidden = false
    document.getElementById("stopscanbtn").hidden = true

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

const stopScanClick = async() => {
  BarcodeScanner.stopScan()
  document.getElementById("misc-out").hidden = false
  document.getElementById("scanbtn").innerText = "Start scan (Previous scan aborted)"
  document.getElementById("scannerbars").hidden = true
  document.getElementById("scanbtn").hidden = false
  document.getElementById("output").hidden = false
  document.getElementById("stopscanbtn").hidden = true
}

</script>

<div>
  <div id = "output" class=" bg-green-300 w-screen overflow-x-visible"></div>
  <div id = "scannerbars" class="z-0" hidden>
    <div class="w-[15%] fixed left-0 bg-black h-screen"></div>
    <div class="w-[15%] fixed right-0 bg-black h-screen"></div>
    <div class="h-[35%] fixed top-0 bg-black w-screen"></div>
    <div class="h-[35%] fixed bottom-0 bg-black w-screen text-white text-center font-semibold">Show ticket QR<br>If QR isn't focusing<br>try centering it,<br>moving closer or farther,<br>or exiting and restarting the scan.<br></div>
  </div>
  <button id = "scanbtn" class="h-10 w-screen bg-slate-600 text-white" on:click={startScan}>Start Scan</button>
  <div class=" fixed left-0 bottom-0 block w-screen">
    <button id = "stopscanbtn" class="h-10 rounded-lg  translate-x-[5%] z-20 fixed bottom-5 w-[90%] m-auto bg-slate-600 text-white" on:click={stopScanClick} hidden>Exit</button>
  </div>
  

</div>