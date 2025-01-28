//Session storage variable uplist, currentContext created here
//Fix current track session variable situation at some point
import { useState, useEffect } from 'react';
import './WebPlayback.css'
import { Routes, Route } from "react-router-dom"
import Home from '../../routes/Home';
import Album from '../../routes/Album';
import Playlist from '../../routes/Playlist.tsx';
import Artist from '../../routes/Artist.tsx';
import Logo from '../Logo/Logo.tsx';
import Discover from '../../routes/Discover.tsx';
import Categories from '../../routes/Categories.tsx';
import BottomBar from '../BottomBar/BottomBar.tsx';
import PollPlayer from '../PollPlayer.tsx';

declare global {
    interface Window{
        onSpotifyWebPlaybackSDKReady: any;
        Spotify: any;
    }
}
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
}
export default function WebPlayback() {

    const [player, setPlayer] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState(true) 
    const [is_paused, setPaused] = useState<any>(false);
    const [is_active, setActive] = useState<any>(false);
    const [current_track, setTrack] = useState(track);
    const [pos, setPos] = useState<any>(0)
    const [duration, setDuration] = useState<any>(0)
    //Used to keep track of current device. used in Track and Ptrack Component
    const [currentDev, setCurrentDev] = useState({name: "TheSound", id: sessionStorage.getItem("device_id"!)})             

    useEffect(() => {        
///////////////////////////Create Spotify web player client
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            var token = ''
            const fetchToken = async () => {
                const response = await fetch("https://playground.jmpeterson.dev/auth/token")
                const data = await response.json()
                token = data.items
                sessionStorage.setItem("token", data.items)                
            }
            fetchToken()
            
            document.body.appendChild(script);
            
            window.onSpotifyWebPlaybackSDKReady = () => {  
                
                    const player = new window.Spotify.Player({ 
                        name: 'TheSound',
                        getOAuthToken: (cb: any) => { cb(token); },
                        volume: 1
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
                        setTrack(state.track_window.current_track);      
                          
                        setPaused(state.paused)      
            
                        setDuration(state.duration)        
            
                        setPos(state.position)      
                        
                        sessionStorage.setItem("name", state.track_window.current_track.album.name)
                        sessionStorage.setItem("current", state.track_window.current_track.uri)
                        sessionStorage.setItem("currentTrack",JSON.stringify(state.track_window.current_track))                                                 
                    
                        player.getCurrentState().then( (state: any) => { 
                            !state ? setActive(false) : setActive(true)                            
                                                                                                                                          
                        })
                    }))
                                                            
                    player.connect();
                    setIsLoading(false)                        
            };            
    }, []);

    return (
        <>
            {isLoading ? null : (
                <>
                    <Logo />
                    <Routes>
                    <Route path = '/' element={<Home/>} key={0}/>
                    <Route path='/discover' element={<Discover/>} key={1} />
                    <Route path='/categories/:id' element={<Categories />} key={2}/>
                    <Route path='/album/:id' element={<Album active={is_active}  paused={is_paused} />} key={3}/>
                    <Route path='/playlist/:id' element={<Playlist active={is_active}  paused={is_paused} />} key={4}/>
                    <Route path='/artist/:id' element={<Artist paused={is_paused} />} key={5}/>
                    </Routes>    

                    <BottomBar player={player} is_active={is_active} is_paused={is_paused} setPaused={setPaused} duration={duration} current_track={current_track} pos={pos} currentDev={currentDev} setCurrentDev={setCurrentDev}  />
                    <PollPlayer setCurrentDev={setCurrentDev} currentDev={currentDev} setTrack={setTrack} duration={setDuration} paused={setPaused}/>            
                </>
            )}
        
        </>
    )
}
