import {useState, useEffect, useRef} from 'react';
import { throttle } from './useThrottle';
import { useAppSelector, useAppDispatch } from '../App/hooks.ts';
import { setPlaying } from '../App/defaultSlice.ts';
import { useNavigate } from 'react-router-dom';
import { spotifyRequest } from '../utils/utils';
import { setLogoutCallback, resetInactivityTimer, initInactivityTimer, stopInactivityTimer } from '../utils/authTimerV2.ts';


const track: any = {
    name: "",
    album: {
        images: [
            { url: "" }
        ],
        uri: "",
        name: ""
    },
    artists: [
        { name: "" }
    ],
    uri: ""
};

const intialPlayerState = {
    current_track: track,
    is_paused: false,
    duration: 0,
    pos: 0
};

function stateUpdates(state: any, setPlayerState: any){
    //console.log('hi');

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
        if (keys.length > 35){
            let lastKey: any = keys.pop()
            delete temp[lastKey]
        }   
        localStorage.setItem("recent", JSON.stringify(temp))       
    }
}

let cachedToken: string | null = null;
let cachedAt = 0;     
const TTL = 4 * 60 * 1000;

export const usePlayer = () => {
    const [player, setPlayer] = useState<any>(null); 
    const [playerState, setPlayerState] = useState(intialPlayerState)                   
    const [is_active, setActive] = useState(false); 
    const playing = useAppSelector(state => state.defaultState.playing);
    const dispatch = useAppDispatch();      
    const navigate = useNavigate();

    const resetPlayer = async () => {   
        sessionStorage.clear();

        stopInactivityTimer();
        
        await player?.disconnect();

        setPlayer(null);

        setPlayerState(intialPlayerState);

        setActive(false);          
    };

    const playingRef = useRef(playing);

    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);

    useEffect(() => {
        //if(!access_token) return;
        resetPlayer();

        initInactivityTimer();
        
        const debUpdate = throttle(stateUpdates, 500);

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);      

        window.onSpotifyWebPlaybackSDKReady = () => {         
            const player = new window.Spotify.Player({ 
                name: 'TheSound',
                //getOAuthToken: (cb: any) => { cb(access_token); },
                getOAuthToken: async (cb: any) => {
                    const now = Date.now();

                    if (cachedToken && now - cachedAt < TTL) {
                        return cb(cachedToken);
                    }

                    try {
                        const data = await spotifyRequest("/token");

                        cachedToken = data.access_token;
                        cachedAt = now;

                        cb(cachedToken);
                    } catch (err) {
                        console.error("Spotify token fetch failed", err);
                    }
                },
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
                
                dispatch(setPlaying(!state.paused));

                if(!sessionStorage.getItem("current")) setActive(true);
                
                debUpdate(state, setPlayerState);                                                                
            }))
                                                    
            player.connect();                                    
        };  

        setLogoutCallback(() => {            
            if (!playingRef.current) {
                resetPlayer();

                navigate("/", {replace: true});
            } else {
                resetInactivityTimer();
            }            
        });                
    }, []);    
    
    return {player, playerState, setPlayerState, is_active, resetPlayer};
}