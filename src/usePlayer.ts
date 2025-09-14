import {useState, useEffect} from 'react';
import useAuth from './hooks/useAuth';
import { throttle } from './hooks/useThrottle';
import { track } from './utils';

function stateUpdates(state: any, setPlayerState: any){
    //console.log('hi')      
    setPlayerState({current_track: state?.track_window.current_track, is_paused: state?.paused, duration: state?.duration, pos: state?.position})
    
    sessionStorage.setItem("paused", state?.paused)
    sessionStorage.setItem("name", state?.track_window?.current_track?.album.name)
    sessionStorage.setItem("current", state?.track_window?.current_track?.uri)
    sessionStorage.setItem("currentTrack",JSON.stringify(state?.track_window?.current_track))              
                    
    if(state?.track_window?.current_track){
    
        let temp = localStorage.getItem("recent") ? JSON.parse(localStorage.getItem("recent")!) : {}
        var parts = state?.track_window?.current_track.album.uri.split(':');
        var lastSegment = parts.pop() || parts.pop();           
        let keys = Object.keys(temp)                                     
        
        temp[lastSegment] ? (                        
            parts = temp[lastSegment],
            delete  temp[lastSegment],
            temp = {[lastSegment]: parts, ...temp}) 
            : temp = {[lastSegment]: {id: lastSegment,name: state?.track_window?.current_track?.album.name,artists: state?.track_window?.current_track?.artists,images: state?.track_window?.current_track?.album.images}, ...temp}
        // console.log(temp)

        // console.log(keys)     
        if (keys.length > 20){
            let lastKey: any = keys.pop()
            delete temp[lastKey]
        }   
        localStorage.setItem("recent", JSON.stringify(temp))       
    }
}


export const usePlayer = () => {
    const [player, setPlayer] = useState(); 
    const [playerState, setPlayerState] = useState({current_track: track, is_paused: false, duration: 0, pos: 0})                   
    const [is_active, setActive] = useState(false);                    

    const access_token = useAuth()

    useEffect(() => {
        if(!access_token) return        

        const debUpdate = throttle(stateUpdates, 500);

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);      

        window.onSpotifyWebPlaybackSDKReady = () => {                                      
            const player = new window.Spotify.Player({ 
                name: 'TheSound',
                getOAuthToken: (cb: any) => { cb(access_token); },
                volume: 1,                              
            });
            setPlayer(player);                    
            
            player.addListener('ready', ({ device_id }:any) => {
                console.log('Ready with Device ID', device_id);
                sessionStorage.setItem("device_id", device_id);                                                                
            });

            player.addListener('not_ready', ({ device_id }: any) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('initialization_error', ({ message }: any) => {
                console.error(message);
            });
        
            player.addListener('authentication_error', ({ message }: any) => {
                console.error(message);
            });
        
            player.addListener('account_error', ({ message }: any) => {
                console.error(message);
            });            
            
            player.addListener('player_state_changed', ( (state: any) => {
                if (!state) {                                        
                    return;
                }

                if(!sessionStorage.getItem("current")) setActive(true)
                debUpdate(state, setPlayerState);                                                                
            }))
                                                    
            player.connect();                                    
        };
    }, [access_token]);
    
    return {player, playerState, setPlayerState, is_active};
}