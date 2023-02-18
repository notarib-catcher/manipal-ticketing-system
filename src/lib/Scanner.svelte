<script>
    import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
    import { Dialog } from '@capacitor/dialog'

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
  document.getElementById("output").hidden = true
  document.getElementById("scannerbars").hidden = false

  // Check camera permission
  // This is just a simple example, check out the better checks below
  

  // make background of WebView transparent
  // note: if you are using ionic this might not be enough, check below
  await BarcodeScanner.hideBackground();

  const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] }); // start scanning and wait for a result

  // if the result has content
  if (result.hasContent) {
    await BarcodeScanner.stopScan()
    await BarcodeScanner.showBackground()
    document.getElementById("scanbtn").innerText = "SUCCESS"
    document.getElementById("scannerbars").hidden = true

    document.getElementById("scanbtn").hidden = false
    document.getElementById("output").hidden = false
    document.getElementById("output").innerText = "Scanned: " + result.content
  }
};

</script>

<div>
  <div id = "output" class=" bg-green-300 w-screen"></div>
  <div id = "scannerbars" class="z-0" hidden>
    <div class="w-[25%] fixed left-0 bg-black h-screen"></div>
    <div class="w-[25%] fixed right-0 bg-black h-screen"></div>
    <div class="h-[30%] fixed top-0 bg-black w-screen"></div>
    <div class="h-[30%] fixed bottom-0 bg-black w-screen text-white text-center font-semibold">Show ticket QR</div>
  </div>
  <button id = "scanbtn" class="h-10 w-screen bg-slate-600 text-white" on:click={startScan}>Start Scan</button>
</div>