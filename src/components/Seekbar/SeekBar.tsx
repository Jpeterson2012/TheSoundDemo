import { useState, useEffect, useRef } from "react"
import './SeekBar.css'

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

export default function SeekBar({duration, player, paused}: any){
  
    const [pos, setPos] = useState<any>(0)
        
    let found = sessionStorage.getItem("currentContext") === null ? true : sessionStorage.getItem("currentContext") === "null" ? true : false
    
    //Checks if current device is The Sound. If not uses session variable to update song progress
    if (found){
      useInterval(() => {
        paused ? null : player?.getCurrentState().then((state: any) => {
           setPos(state?.position)
         })
      },1000)
    }
    else{
      useInterval(() => {
        setPos(sessionStorage.getItem("progress") ? sessionStorage.getItem("progress") : 0)
      },3000)
    }          

    return(
        <input id='seeker' type='range' min="0" max={duration === undefined ? 0 : duration} value={pos === undefined ? 0 : pos} step="100" onChange={function handleChange(e){ 
            setPos(e.target.value)
            let temp = (document.getElementById('seeker') as HTMLInputElement)

            if(found) {
              player.seek(e.target.value)              
            }
            else 
              setTimeout(() => {                
                fetch(import.meta.env.VITE_URL + `/player/seek/${sessionStorage.getItem("currentContext")},${+e.target.value}`, {
                  method: 'POST',
                  credentials: "include",
                  headers: {"Content-Type":"application/json"},                                        
                })
              },150)
            
        }}/>
    )
}

export { useInterval }
