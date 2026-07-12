//Session storage var progress created here, used in SeekBar
import { useInterval } from "../hooks/useInterval.ts";
import { useContext } from "react";
import UsePlayerContext from "../hooks/PlayerContext.tsx";
import { spotifyRequest } from "../utils/utils.ts";

export default function PollPlayer({setCurrentDev,currentDev}: any){
  const {playerState, setPlayerState} = useContext(UsePlayerContext);

  useInterval(() => {                
    const poll = async () => {            
      const data = await spotifyRequest('/player');      

      if (currentDev.name !== data.device.name) {
        if (data.device.name === "TheSound") {
          setCurrentDev({name: "TheSound", id: sessionStorage.getItem("device_id"!)});

          sessionStorage.setItem("currentContext", "null");
        } else {
          setCurrentDev({name: data.device.name, id: data.device.id});   

          sessionStorage.setItem("currentContext", data.device.id);          

          setPlayerState({...playerState, current_track: data.item, is_paused: !data.is_playing, duration: data.item.duration_ms});

          sessionStorage.setItem("name", data.item.album.name);

          sessionStorage.setItem("current", data.item.uri);

          sessionStorage.setItem("currentTrack",JSON.stringify(data.item)) ;

          sessionStorage.setItem("progress",data.progress_ms);          
        }           
      } else if (currentDev.name !== "TheSound") {
        setPlayerState({...playerState, current_track: data.item, is_paused: !data.is_playing, duration: data.item.duration_ms})

        sessionStorage.setItem("name", data.item.album.name);

        sessionStorage.setItem("current", data.item.uri);

        sessionStorage.setItem("currentTrack",JSON.stringify(data.item));

        sessionStorage.setItem("progress",data.progress_ms);          
      }                               
    } 
    //Checks if current device is The Sound. If not uses spotify api to get current track
    //poll();

  }, (sessionStorage.getItem("currentContext") && sessionStorage.getItem("currentContext") !== "null") ? 3000 : 5000);

  return(
    <>
    </>
  );
};