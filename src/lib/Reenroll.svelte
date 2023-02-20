<script>
    import { Preferences } from '@capacitor/preferences';
  import { cscanstate } from './cscan';
    import { doassignmentagain, doenrollmentagain, kioskassignment, kioskName, kioskTKN, tempinputstore } from "./deets";

    const unenroll = async (value) => {
        if(!value){
            return
        }

        doenrollmentagain.set(false)

        Preferences.remove({key:"assignment"})
        Preferences.remove({key:"serverIP"})
        Preferences.remove({key:"token"})
        Preferences.remove({key:"name"})

        cscanstate.set([null,null,"fail"])
        kioskName.set("")
        kioskassignment.set([null,null])
        doassignmentagain.set(false)
        tempinputstore.set([null,null,null])

        //Kiosk token updated last since this triggers reload
        kioskTKN.set(null)
    }

    doenrollmentagain.subscribe(unenroll)
</script>
