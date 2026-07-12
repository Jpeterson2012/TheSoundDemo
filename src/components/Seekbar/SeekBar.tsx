import { useState, useEffect } from "react";
import './SeekBar.css';
import { useInterval } from "../../hooks/useInterval.ts";
import { spotifyRequest } from "../../utils/utils.ts";

export default function SeekBar({duration, player, paused}: any) {  
  const [pos, setPos] = useState<any>(0);
  const [isSeeking, setIsSeeking] = useState(false);
      
  let found = [undefined, null, "null"].includes(sessionStorage.getItem("currentContext")) ??  false;

  useEffect(() => {   
    setPos(0);    
  }, [duration]);
  
  //Checks if current device is The Sound. If not uses session variable to update song progress
  if (found) {
    useInterval(() => {
      if (paused || isSeeking) return;

      player?.getCurrentState().then((state: any) => {
        setPos(state?.position);
      });
    },1000);
  } else {
    useInterval(() => {
      setPos(sessionStorage.getItem("progress") ?? 0);
    },3000);
  }          

  return(
    <input 
      id='seeker' 
      type='range' 
      min="0" 
      max={duration ?? 0} 
      value={pos ?? 0} 
      step="100" 
      onPointerDown={() => setIsSeeking(true)}
      onPointerUp={(e) => {
        const value = Number(e.currentTarget.value);      
        
        setIsSeeking(false);

        if(found) {
          player.seek(value);              
        } else 
          setTimeout(() => {         
            spotifyRequest(`/player/seek/${sessionStorage.getItem("currentContext")},${+value}`, 'POST');
          },150);
      }}
      onChange={(e) => { 
        setPos(e.target.value);        
      }}
    />
  );
};

export { useInterval };