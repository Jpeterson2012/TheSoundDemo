import { useState } from "react"
import './SeekBar.css'
import { useInterval } from "../../hooks/useInterval.ts"

export default function SeekBar({duration, player, paused}: any){
  
  const [pos, setPos] = useState<any>(0)
      
  let found = !sessionStorage.getItem("currentContext") || sessionStorage.getItem("currentContext") === "null" ? true : false
  
  //Checks if current device is The Sound. If not uses session variable to update song progress
  if (found){
    useInterval(() => {
      !paused && player?.getCurrentState().then((state: any) => {
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