//Session storage variable uplist, currentContext created here
//Fix current track session variable situation at some point
import './BottomBar.css'
import 'react-responsive-modal/styles.css';
import { useEffect, useState, useContext } from 'react'
import UsePlayerContext from '../../hooks/PlayerContext.tsx'
import { useGetDevicesQuery, useGetAlbumsQuery } from '../../App/ApiSlice.ts';
import { useNavigate } from "react-router-dom"
import { Spin2 } from '../Spin/Spin.tsx';
import { Modal } from 'react-responsive-modal';
import shuffle from '../../images/shuffle.png'
import repeat from '../../images/repeat.png'
import repeat1 from '../../images/repeat1.png'
import SeekBar from '../Seekbar/SeekBar.tsx';
import AddLiked from '../AddLiked/AddLiked.tsx';
import volume from '../../images/volume.png'
import device from '../../images/device.png'
import { spotifyRequest, stockImage } from '../../utils/utils.ts';
import { closeIcon } from '../../helpers/CloseIcon.tsx';
import { useAppDispatch } from '../../App/hooks.ts';
import { setCurrentAlbum } from '../../App/defaultSlice.ts';
import { useResponsive } from '../../hooks/ResponsiveContext.tsx';

function playbackState(uri: string, playerState?: any, setPlayerState?: any, currentDev?: any){
    //Playback controls when current device isnt this application    
    
    switch(uri){
        case 'pause':            
            spotifyRequest(`/player/pause/${currentDev.id}`, 'POST');

            setPlayerState({...playerState, is_paused: true});            
            break;
        case 'play':
            spotifyRequest(`/player/play/${currentDev.id}`, 'POST');

            setPlayerState({...playerState, is_paused: false});            
            break;
        case 'previous':
            spotifyRequest(`/player/previous/${currentDev.id}`, 'POST');

            break;
        case 'next':
            spotifyRequest(`/player/next/${currentDev.id}`, 'POST');

            break;
        default:
            break;

    }
};

export default function BottomBar({currentDev, setCurrentDev}:any){    
    const [shuffled, setisShuffled] = useState(true);
    const [repeated, setRepeated] = useState(0);
    const [open, setOpen] = useState(false);
    const onOpenModal = () => {setOpen(true)};
    const onCloseModal = () => {setOpen(false)};
    
    const {data: devices = [], isSuccess: isFetching, refetch} = useGetDevicesQuery();
    const {data: albums = []} = useGetAlbumsQuery();
    
    const navigate = useNavigate();

    let pVol: any = "1";

    const {player, playerState, setPlayerState, is_active} = useContext(UsePlayerContext);

    const {isMobile} = useResponsive();

    const dispatch = useAppDispatch();

    useEffect(() => {
    
    },[playerState.current_track?.name]);

    const albumDisplay = () => {
        return (
            <a                     
                onClick={() => {
                    const parts = playerState.current_track.album.uri.split(':');

                    let lastSegment = parts.pop() || parts.pop();
                    
                    const found = (albums?.find((e: any) => e?.album_id === lastSegment) || (albums?.find((e: any) => e?.name === playerState.current_track.album.name)));

                    if (found){
                        if (lastSegment !== found?.album_id) lastSegment = found?.album_id;                        
                    }                        

                    const artist_names: any[] = [];

                    const artist_ids: any[] = [];

                    playerState.current_track.artists.forEach((artist: any) => { 
                        artist_names.push(artist.name);

                        artist_ids.push(artist.uri.split(':').pop());
                    });

                    dispatch(setCurrentAlbum({
                        uri: playerState.current_track.album.uri,
                        artists: artist_names,
                        artist_ids: artist_ids,
                        image: playerState.current_track.album.images?.find((image: any) => image.height == 640)?.url,
                        albumName: playerState.current_track.album.name,
                    }));

                    playerState.current_track.type !== 'episode' && navigate(`/app/album/${lastSegment}`);
                }}
            >
                <span>
                    <img 
                        src={["", null, undefined].includes(playerState.current_track?.album?.images[0]?.url) ? stockImage : playerState.current_track?.album?.images[0]?.url} 
                        alt="" style={{left: '-3px', bottom: '0', zIndex: '1', position: 'absolute', height: !isMobile ? '55px': '50px', width: !isMobile ? '55px': '50px'}} 
                    />
                    
                    <div>{is_active && Spin2(is_active,playerState.is_paused)}</div>
                </span>
            </a>
        );
    };

    const albumMetadata = () => {
        return (
            <div className="songDescription" style={!isMobile ? {alignItems: 'start'} : {alignItems: 'center', position: 'absolute', bottom: '-120px'}}>                    
                <div style={{fontWeight: 'bold',margin: '0px', padding: '0px', color: !isMobile ? 'rgb(90, 210, 216)' : 'black'}}>
                    {playerState.current_track?.name}
                </div>                    
                                        
                <div style={{color: 'rgb(90, 210, 216)', margin: '0px', padding: '0px', gap: '1rem'}}>                        
                    {playerState.current_track?.artists.map((artist: any, i: number, row: any) => 
                        <a 
                            key={i} 
                            style={{color: !isMobile ? 'rgb(90, 210, 216)' : 'black', fontWeight: 'bold'}}
                            onClick={() => { 
                                playerState.current_track?.type !== 'episode' && navigate(`/app/artist/${artist.uri.split(':').pop()}`);
                            }} 
                        >
                            {row.length - 1 !== i ? artist.name + ", " : artist.name}
                        </a>
                    )}
                </div>                                                    
            </div>
        );
    };

    const addLikedSong = () => {
        return (
            <AddLiked active={is_active} trackUri={playerState.current_track} duration={playerState.duration}/>
        );
    };

    const volumeIcon = () => {
        return (
            <img style={{height: '30px', cursor: 'pointer'}} src={volume} id="volumeIcon"
                onMouseEnter={(e) => {
                    const el = e.target as HTMLElement;

                    el.style.opacity = '1';
                }} 
                onMouseLeave={(e) => {
                    const el = e.target as HTMLElement;

                    player.getVolume().then((vol: any) => el.style.opacity = !vol  ? '0' : pVol);
                }} 
                onClick={(e) => {
                    let temp: HTMLInputElement = e.currentTarget.parentElement?.querySelector('#volumeBar')!;

                    const found = [null, "null"].includes(sessionStorage.getItem("currentContext")) ?? false;
                    
                    if(temp.value === "0") {
                        player?.setVolume(+pVol);

                        temp.value = pVol;
                    
                        //Checks if current device is The Sound. If not uses spotify api to change volume
                        if(!found) {
                            spotifyRequest(`/player/volume/${sessionStorage.getItem("currentContext")},${+pVol * 100}`, 'POST');
                        }
                    
                        e.currentTarget.style.opacity = "1";
                    } 
                    else{ 
                        player?.setVolume(0);

                        pVol = temp.value;

                        temp.value = "0";
                    
                        //Checks if current device is The Sound. If not uses spotify api to change volume
                        if(!found){  
                            spotifyRequest(`/player/volume/${sessionStorage.getItem("currentContext")},${0}`, 'POST');
                        }
                    
                        e.currentTarget.style.opacity = "0";
                    }
                }}
            />
        );
    };

    const volumeBar = () => {
        return (
            <input 
                id='volumeBar' 
                style={{minWidth: '85%'}}
                type='range' 
                min={0} 
                max={1} 
                step={0.05}                     
                onChange={(e) => {
                    let temp2 = document.getElementById("volumeIcon")!;   

                    const found = [null, "null"].includes(sessionStorage.getItem("currentContext")) ?? false;

                    e.target.value === "0" ? temp2.style.opacity = '0' : temp2.style.opacity = e.target.value;

                    pVol = e.target.value;

                    //Checks if current device is The Sound. If not uses spotify api to change volume
                    if(found) player?.setVolume(e.target.value); 
                    else{
                        //Waits for user to release handle so api isn't getting polled multiple times a second                                
                        setTimeout(() => { 
                            spotifyRequest(`/player/volume/${sessionStorage.getItem("currentContext")},${+e.target.value * 100}`, 'POST');
                        },150);                                
                    }
                }}
            />
        );
    };

    const repeatIcon = () => {
        return (
            <img 
                id='toggle1' 
                src={repeated < 2 ? repeat : repeat1} 
                style={{opacity: !repeated ? '0.5' : 1}} 
                onClick={() => {   
                    let toggle = document.getElementById('toggle1')!;
                    
                    toggle.style.animation = 'hithere 1s ease';  
                
                    if (!repeated) setRepeated(1);
                    else if (repeated === 1) setRepeated(2);
                    else if (repeated === 2) setRepeated(0);         

                    spotifyRequest('/shuffle', 'POST', {
                            body: JSON.stringify({state: !repeated ? 'context' : (repeated === 1 ? 'track' : 'off')}),
                        },
                    );                        
                    setTimeout(() => {
                        toggle.style.removeProperty('animation');
                    }, 750);                        
                }}
            />
        );
    };

    const musicBars = () => {
        return (
            <div className="now_playing" id="music">
                <span className="bar n1">A</span>
                <span className="bar n2">B</span>
                <span className="bar n3">c</span>
                <span className="bar n4">D</span>
                <span className="bar n5">E</span>
                <span className="bar n6">F</span>
                <span className="bar n7">G</span>
                <span className="bar n8">H</span>
            </div>
        );
    };

    const fullSizeOptions = () => {
        return (
            <div style={{display: 'flex'}}>
                <button 
                    className="btn-spotify" 
                    style={{width: '70px'}} 
                    onClick={() => { 
                        currentDev.name === "TheSound" 
                            ? (playerState.pos > 3000 ? player!.seek(0) : player!.previousTrack()) 
                            : playbackState('previous', null, null, currentDev); 
                    }}
                >
                    &lt;&lt;
                </button>
                
                <button 
                    className="btn-spotify" 
                    style={{width: '80px', padding: ' 8px 0px'}}  
                    onClick={() => { 
                        currentDev.name === "TheSound" 
                            ? player!.togglePlay() 
                            : playbackState(playerState.is_paused ? 'play' : 'pause', playerState, setPlayerState, currentDev);
                    }} 
                >
                    { playerState.is_paused ? "PLAY" : "PAUSE" }
                </button>
                
                <button 
                    className="btn-spotify" 
                    style={{width: '70px'}} 
                    onClick={() => { 
                        currentDev.name === "TheSound" 
                            ? player!.nextTrack() 
                            : playbackState('next', null, null, currentDev); 
                    }}
                >
                    &gt;&gt;
                </button>
            </div>
        );
    };

    const smallOptions = () => {
        return (
            <div className='spotifyButtonContainer'>                        
                <p 
                    className="spotifyButtons1" 
                    onClick={() => { 
                        currentDev.name === "TheSound" 
                            ? (playerState.pos > 3000 ? player!.seek(0) : player!.previousTrack()) 
                            : playbackState('previous', null, null, currentDev); 
                    }} 
                >
                    &lt;&lt;
                </p>
                
                <a 
                    onClick={() => { 
                        currentDev.name === "TheSound" 
                            ? player!.togglePlay() 
                            : playbackState(playerState.is_paused ? 'play' : 'pause', playerState, setPlayerState, currentDev);
                        }}
                    >
                    <p className="spotifyButtons2">
                        { playerState.is_paused ? "PLAY" : "PAUSE" }
                    </p>
                </a>                        
                
                <p 
                    className="spotifyButtons3"
                    onClick={() => { 
                        currentDev.name === "TheSound" ? player!.nextTrack() : playbackState('next', null, null, currentDev) ;
                    }} 
                >
                    &gt;&gt;
                </p>
            </div>
        );
    };

    const shuffleIcon = () => {
        return (
            <img 
                id='toggle2' 
                src={shuffle} 
                style={{opacity: shuffled ? '0.5' : '1'}} 
                onClick={() => {                             
                    let toggle = document.getElementById('toggle2')!;

                    toggle.style.animation = 'hithere 1s ease'
                
                    if (shuffled) setisShuffled(false);
                    else setisShuffled(true);          
                    
                    spotifyRequest('/shuffle', 'POST', {
                        body: JSON.stringify({state: shuffled}),
                    });

                    setTimeout(() => {
                        toggle.style.removeProperty('animation');
                    }, 750); 
                }} 
            />
        );
    };

    const seekBar = () => {
        return (
            <SeekBar duration={playerState.duration} player={player} paused={playerState.is_paused} />
        );
    };

    const devicesIcon = () => {
        return (
            <img 
                style={{height: '42px', cursor: 'pointer'}} 
                src={device} 
                onClick={() => {      
                    refetch();

                    onOpenModal();                      

                    !isFetching && console.log(devices);                                                
                }} 
            />
        );
    };

    const devicesModal = () => {
        return (
            <Modal modalId='modal1' open={open} onClose={onCloseModal} closeIcon={closeIcon()}>
                <div style={{marginTop: '60px'}}>
                    <p style={{color: 'black', fontWeight: 'bold', fontSize: '20px'}}>Current Device</p>

                    {/* <p>{mainDevice!.name}</p> */}
                    <p>{currentDev.name}</p>

                    <p style={{color: 'black', fontWeight: 'bold', fontSize: '20px'}}>Select Another Device</p>

                    <a 
                        onClick={() => {
                            setCurrentDev({name: "TheSound", id: sessionStorage.getItem("device_id")});

                            sessionStorage.setItem("currentContext", "null");

                            spotifyRequest(`/player/${sessionStorage.getItem("device_id")}`, 'POST');
                        }}
                    >
                        <p>TheSound</p> 
                    </a>

                    {devices.map((device:any,i:any) =>
                        device.name === "TheSound"
                            && <a 
                                key={i} 
                                onClick={() => {
                                    // console.log(a);

                                    setCurrentDev({name: device.name, id: device.id});

                                    sessionStorage.setItem("currentContext", device.id);

                                    spotifyRequest(`/player/${device.id}`, 'POST');
                                }}
                            >
                                <p>{device.name}</p> 
                            </a> 
                    )}
                </div>
            </Modal>
        );
    };

    return(
        <div 
            style={{
                position: 'fixed', height: '60px', bottom: '0', left: '0', width: '100vw', zIndex: '3', display: 'grid', 
                alignItems: 'center', gridTemplateColumns: "1.5fr 0.25fr 1fr 1fr 0fr 2.5fr 0.25fr", background: 'black', gap: '10px',
            }}
        >            
            <div style={{minWidth: 0, display: 'flex', gap: !isMobile ? '95px' : '0px'}}>
                {albumDisplay()}

                {albumMetadata()}                                                                                                            
            </div>
    
            {addLikedSong()}

            <div style={{display: 'flex', alignItems: 'center', width: '95%'}}>
                {/* Replaced old modal method for adding to playlists here */}                    

                {volumeIcon()}

                {volumeBar()}
            </div>            

            <div style={{display: 'flex', justifyContent: 'space-around', gap: '30px', alignItems: 'center'}}>
                {repeatIcon()}                

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {(is_active && !playerState.is_paused) && musicBars()}

                    {!isMobile ? fullSizeOptions() : smallOptions()}
                </div>                                                
                
                {shuffleIcon()}     
            </div>

            <div></div>

            {seekBar()}

            <div className='deviceImg' style={{justifySelf: 'flex-end'}}>
                {devicesIcon()}

                {devicesModal()}
            </div>                
        </div>        
    );
}