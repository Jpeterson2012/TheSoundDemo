//Session storage var progress created here, used in SeekBar
import { useEffect,useRef } from "react";

function useInterval(callback: any, delay: any){
    const savedCallback: any = useRef();
   
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
   
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

export default function PollPlayer({setCurrentDev,currentDev,setTrack,duration,paused}: any){

    useInterval(() => {            
        const poll = async () => {
            const resp = await fetch('https://playground.jmpeterson.dev/auth/player')
            const data = await resp.json()
            if (currentDev.name !== data.device.name) {
              setCurrentDev({name: "TheSound", id: sessionStorage.getItem("device_id"!)})
              sessionStorage.setItem("currentContext", "null")
            }
            if (data.is_playing === false) paused(true)
            else paused(false)
            setTrack(data.item)
            duration(data.item.duration_ms)
            sessionStorage.setItem("name", data.item.album.name)
            sessionStorage.setItem("current", data.item.uri)
            sessionStorage.setItem("currentTrack",JSON.stringify(data.item))
            sessionStorage.setItem("progress",data.progress_ms)
                        
        } 
        //Checks if current device is The Sound. If not uses spotify api to get current track
        (sessionStorage.getItem("currentContext") === null || sessionStorage.getItem("currentContext") === "null") ? null :  poll()

    },3000)
    return(
        <>
        </>
    )
}