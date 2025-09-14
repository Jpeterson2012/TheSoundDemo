//Session storage variable uplist, currentContext created here
//Fix current track session variable situation at some point
import './BottomBar.css'
import 'react-responsive-modal/styles.css';
import { useEffect, useState, useContext } from 'react'
import UsePlayerContext from '../../contexts/PlayerContext.tsx'
import { useGetDevicesQuery, useGetAlbumsQuery } from '../../App/ApiSlice.ts';
import { useNavigate } from "react-router-dom"
import { Spin2 } from '../Spin/Spin.tsx';
import { Modal } from 'react-responsive-modal';
import { windowSizes } from '../../hooks/useGeneral.ts';
import shuffle from '../../images/shuffle.png'
import repeat from '../../images/repeat.png'
import repeat1 from '../../images/repeat1.png'
import HScroll from '../HScroll.tsx';
import SeekBar from '../Seekbar/SeekBar.tsx';
import AddLiked from '../AddLiked/AddLiked.tsx';
import volume from '../../images/volume.png'
import device from '../../images/device.png'
import escape from '../../images/escape.jpg'

function playbackState(uri: string, setPlayerState: any, currentDev: any){
    //Playback controls when current device isnt this application    
    let url = import.meta.env.VITE_URL + "/player"
    switch(uri){
        case '/pause':
            fetch(url + uri + `/${currentDev.id}`, {
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                credentials: "include"                
            })
            setPlayerState({is_paused: true})            
            break
        case '/play':
            fetch(url + uri + `/${currentDev.id}`, {
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                credentials: "include"                
            })
            setPlayerState({is_paused: false})            
            break
        case '/previous':
            fetch(url + uri + `/${currentDev.id}`, {
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                credentials: "include"                
            })
            break
        case '/next':
            fetch(url + uri + `/${currentDev.id}`, {
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                credentials: "include"                
            })
            break
        default:
            break

    }
}

export default function BottomBar({currentDev, setCurrentDev}:any){    
        
    const [shuffled, setisShuffled] = useState(true)
    const [repeated, setRepeated] = useState(0)                   
    const [open, setOpen] = useState(false);
    const onOpenModal = () => {setOpen(true)}
    const onCloseModal = () => {setOpen(false)}
    const closeIcon = (
        <img src={escape} style={{height: '44px', width: '44px'}}/>
    )
    const {data: devices = [], isSuccess: isFetching, refetch} = useGetDevicesQuery()        
    const {data: albums = []} = useGetAlbumsQuery()
    
    const navigate = useNavigate()
    let pVol: any = "1"
    let trackName = document.getElementById('now-playing__name2')!   
    let artistName = document.getElementById('now-playing__artist2')!
    const {windowWidth} = windowSizes();
    
    let boolVal = (trackName?.clientWidth > windowWidth || artistName?.clientWidth > windowWidth)

    const {player, playerState, setPlayerState, is_active} = useContext(UsePlayerContext);

    useEffect(() => {
    
    },[playerState.current_track?.name])

    return(
        <>
            <div className='wrapper'>            
                <div className="main-wrapper">
                    <div className="now-playing__side2" id='now-playing__side2' style={boolVal ? {alignItems: 'start'} : {alignItems: 'center'}}>                        
                        <div className="now-playing__name2" id='now-playing__name2' style={{fontWeight: 'bold',margin: '0px', padding: '0px'}}><p style={{margin: '0px', padding: '0px', gap: '1rem', color: 'black'}}>{
                            playerState.current_track?.name
                            }</p>                                                                                    
                        </div>                                                                            
                        <div className="now-playing__artist2" id='now-playing__artist2' data-direction="right" style={{display: 'flex', flexDirection: 'row',whiteSpace: 'nowrap', alignItems: 'center'}}>
                            {playerState.current_track?.artists.map((s:any,i:number,row:any) => <p key={i} 
                            style={{color: 'black'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</p>)}                                                    
                        </div>                                                        
                    </div>

                    <a onClick={function handleClick() {
                        var parts = playerState.current_track.album.uri.split(':');
                        var lastSegment = parts.pop() || parts.pop();
                        
                        let found = (albums?.find((e: any) => e?.album_id === lastSegment) || (albums?.find((e: any) => e?.name === playerState.current_track.album.name)))            
                        found === undefined ? sessionStorage.setItem("albumStatus", "notuser") : (sessionStorage.setItem("albumStatus","user"),lastSegment === found?.album_id ? null : lastSegment = found?.album_id)

                        var artistss: any[] = []
                        var artist_idss: any[] = []
                        playerState.current_track.artists.map((s: any) => { 
                            artistss.push(s.name),
                            artist_idss.push(s.uri.split(':').pop())
                        })

                        sessionStorage.setItem("uri", playerState.current_track.album.uri)
                        sessionStorage.setItem("artist", JSON.stringify(artistss))
                        sessionStorage.setItem("artist_id", JSON.stringify(artist_idss))
                        sessionStorage.setItem("image", playerState.current_track.album.images?.filter((s:any) => s.height === 640).map((s:any) => s.url))
                        // sessionStorage.setItem("name", playerState.current_track.album.name)
                        sessionStorage.setItem("albumname", playerState.current_track.album.name)
                        // console.log(sessionStorage.getItem("name")!.length)

                        playerState.current_track.type === 'episode' ? null : navigate(`/app/album/${lastSegment}`)
                    }}>
                    <span>
                    <img src={playerState.current_track?.album?.images[0]?.url} 
                        className="now-playing__cover" alt="" style={{left: '-3px', bottom: '0', zIndex: '1',position: 'absolute'}} />
                        <div>{is_active && Spin2(is_active,playerState.is_paused)}</div>
                    </span>
                    </a>

                    <div className="now-playing__side">
                        <div className='scrollbar1'>
                            <div className="now-playing__name" style={{fontWeight: 'bold',margin: '0px', padding: '0px'}}><p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{
                                playerState.current_track?.name
                                }</p>
                                {/* <p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{
                                playerState.current_track.name
                                }</p> */}
                                <p className='temp' style={{margin: '0px', padding: '0px'}}>{playerState.current_track?.name}</p>
                                {playerState.current_track?.name ? <HScroll name={"scrollbar1"}/> : null}
                            </div>
                        </div>
                            
                        <div className='scrollbar2'>
                            <div className="now-playing__artist" data-direction="right">
                                <p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{playerState.current_track?.artists.map((s:any,i:number,row:any) => <a key={i} onClick={function handleClick(){ 
                                    playerState.current_track?.type === 'episode' ? null : navigate(`/app/artist/${s.uri.split(':').pop()}`)
                                    }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
                                </p>
                                {/* <p className='temp' style={{margin: '0px', padding: '0px'}}>{playerState.current_track.artists.map((s:any,i:number,row:any) => <a onClick={function handleClick(){ 
                                    navigate(`/app/artist/${s.uri.split(':').pop()}`)
                                    }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
                                </p> */}
                                {playerState.current_track?.name ? <HScroll name={'scrollbar2'} /> : null}
                            </div>
                        </div>                                
                    </div>                                                                                                            
                </div>
        
                <div className='buttonWrapper'>                    
                    <div className='volAddContainer'>
                        {/* Replaced old modal method for adding to playlists here */}
                        <AddLiked active={is_active} trackUri={playerState.current_track} duration={playerState.duration} />

                        <img id="volumeIcon" src={volume} 
                            onMouseEnter={(() => {
                                document.getElementById("volumeIcon")!.style.opacity = '1'
                            })} 
                            onMouseLeave={(()=>{
                                player.getVolume().then((a:any) => document.getElementById("volumeIcon")!.style.opacity = a === 0 ? '0' : pVol)
                            })} 
                            onClick={function handleClick(){
                                let temp = (document.getElementById('volumeBar') as HTMLInputElement)
                                let temp2 = document.getElementById("volumeIcon")!
                                let found = sessionStorage.getItem("currentContext") === null ? true : sessionStorage.getItem("currentContext") === "null" ? true : false
                                console.log(found)
                                if(temp.value === "0") {
                                    player?.setVolume(+pVol)
                                
                                    //Checks if current device is The Sound. If not uses spotify api to change volume
                                    if(found){
                                    temp.value = pVol
                                    }
                                    else{ 
                                    temp.value = pVol
                                    fetch(import.meta.env.VITE_URL + `/player/volume/${sessionStorage.getItem("currentContext")},${+pVol * 100}`, {
                                        method: 'POST',
                                        headers: {"Content-Type":"application/json"},
                                        credentials: "include"                                        
                                    })
                                    }
                                
                                    temp2.style.opacity = "1"
                                } 
                                else{ 
                                    player?.setVolume(0)
                                    pVol = temp.value
                                
                                    //Checks if current device is The Sound. If not uses spotify api to change volume
                                    if(found){  
                                    temp.value = "0"
                                    }
                                    else{ 
                                    temp.value = "0"
                                    fetch(import.meta.env.VITE_URL + `/player/volume/${sessionStorage.getItem("currentContext")},${0}`, {
                                        method: 'POST',
                                        headers: {"Content-Type":"application/json"},
                                        credentials: "include"                                        
                                    })
                                    }
                                
                                    temp2.style.opacity = "0"

                                }
                            }}
                        />
                        <input id='volumeBar' type='range' min={0} max={1} step={0.05} onChange={function handleChange(e){
                            let temp2 = document.getElementById("volumeIcon")!                            
                            let found = sessionStorage.getItem("currentContext") === null ? true : sessionStorage.getItem("currentContext") === "null" ? true : false
                            e.target.value === "0" ? temp2.style.opacity = '0' : temp2.style.opacity = e.target.value

                            pVol = e.target.value

                            //Checks if current device is The Sound. If not uses spotify api to change volume
                            if(found) player?.setVolume(e.target.value) 
                            else{
                            //Waits for user to release handle so api isn't getting polled multiple times a second                                
                                setTimeout(() => { 
                                fetch(import.meta.env.VITE_URL + `/player/volume/${sessionStorage.getItem("currentContext")},${+e.target.value * 100}`, {
                                    method: 'POST',
                                    headers: {"Content-Type":"application/json"},
                                    credentials: "include"                                
                                })
                                },150)                                
                            }
                        }}/>
                    </div>
                    <div className='fiveButtonContainer'>
                        <img id='toggle1' src={repeated < 2 ? repeat : repeat1} style={{opacity: repeated === 0 ? '0.5' : 1}} onClick={function handleClick(){   
                            let temp = document.getElementById('toggle1')!
                            temp.style.animation = 'hithere 1s ease'  
                        
                            if (repeated === 0) setRepeated(1)
                            else if (repeated === 1) setRepeated(2)
                            else if (repeated === 2) setRepeated(0)                                            
                            fetch(import.meta.env.VITE_URL + `/shuffle`, {
                                method: 'POST',
                                headers: {"Content-Type":"application/json"},
                                credentials: "include",
                                body: JSON.stringify({state: repeated === 0 ? 'context' : (repeated === 1 ? 'track' : 'off')})
                            })                        
                            setTimeout(()=>{
                                temp.style.removeProperty('animation')
                            }, 750)                        
                        }}/>

                            { !is_active ? null : ( playerState.is_paused ? null : (
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
                            ))}
                        
                        <button className="btn-spotify" style={{width: '70px'}} onClick={() => { currentDev.name === "TheSound" ? (playerState.pos > 3000 ? player!.seek(0) : player!.previousTrack()) : playbackState('/previous', null, currentDev) }} >
                            &lt;&lt;
                        </button>
                        
                        <button className="btn-spotify" style={{width: '80px', padding: ' 8px 0px'}}  onClick={() => { currentDev.name === "TheSound" ? player!.togglePlay() : (playerState.is_paused ? playbackState('/play', setPlayerState, currentDev) : playbackState('/pause', setPlayerState, currentDev)) }} >
                            { playerState.is_paused ? "PLAY" : "PAUSE" }
                        </button>
                        
                        <button className="btn-spotify" style={{width: '70px'}} onClick={() => { currentDev.name === "TheSound" ? player!.nextTrack() : playbackState('/next', null, currentDev) }} >
                            &gt;&gt;
                        </button>

                        <div className='spotifyButtonContainer'>
                        
                            <p className="spotifyButtons1" onClick={() => { currentDev.name === "TheSound" ? (playerState.pos > 3000 ? player!.seek(0) : player!.previousTrack()) : playbackState('/previous', null, currentDev) }} >
                                &lt;&lt;
                            </p>
                            
                            <a onClick={() => { currentDev.name === "TheSound" ? player!.togglePlay() : (playerState.is_paused ? playbackState('/play', setPlayerState, currentDev) : playbackState('/pause', setPlayerState, currentDev)) }}>
                                <p className="spotifyButtons2" >
                                    { playerState.is_paused ? "PLAY" : "PAUSE" }
                                </p>
                            </a>                        
                            
                            <p className="spotifyButtons3"onClick={() => { currentDev.name === "TheSound" ? player!.nextTrack() : playbackState('/next', null, currentDev) }} >
                                &gt;&gt;
                            </p>
                        </div>
                        
                        <img id='toggle2' src={shuffle} style={{opacity: shuffled ? '0.5' : '1'}} onClick={function handleClick(){     
                        
                            let temp = document.getElementById('toggle2')!
                            temp.style.animation = 'hithere 1s ease'
                        
                            if (shuffled === true) setisShuffled(false)
                            else setisShuffled(true)                
                            fetch(import.meta.env.VITE_URL + `/shuffle`, {
                                method: 'POST',
                                headers: {"Content-Type":"application/json"},
                                credentials: "include",
                                body: JSON.stringify({state: shuffled})
                            })
                            setTimeout(()=>{
                                temp.style.removeProperty('animation')
                            }, 750) }} 
                        />     
                    </div>                           

                    {/* Replaced old music seek bar method here */}
                    <SeekBar duration={playerState.duration} player={player} paused={playerState.is_paused} />
                
                    <img className='deviceImg' src={device} onClick={function handleClick(){      
                        refetch()
                        onOpenModal()
                        // console.log(devices)                                          
                        !isFetching ? console.log(devices) : null                                                
                        }} 
                    />

                    <Modal modalId='modal1' open={open} onClose={onCloseModal} closeIcon={closeIcon} >
                        <div style={{marginTop: '60px'}}>
                            <p style={{color: 'black', fontWeight: 'bold', fontSize: '20px'}}>Current Device</p>
                            {/* <p>{mainDevice!.name}</p> */}
                            <p>{currentDev.name}</p>
                            <p style={{color: 'black', fontWeight: 'bold', fontSize: '20px'}}>Select Another Device</p>
                            <a onClick={function handleClick(){
                                setCurrentDev({name: "TheSound", id: sessionStorage.getItem("device_id")})
                                sessionStorage.setItem("currentContext", "null")
                                fetch(import.meta.env.VITE_URL + `/player/${sessionStorage.getItem("device_id")}`, {
                                    method: 'POST',
                                    credentials: "include",
                                    headers: {"Content-Type":"application/json"},                                        
                                })
                            }}>
                                <p>TheSound</p> 
                            </a> 
                            {devices.map((a:any,i:any) =>
                                a.name === "TheSound" ? null : <a key={i} onClick={function handleClick(){
                                    // console.log(a)                                        
                                    setCurrentDev({name: a.name, id: a.id})
                                    sessionStorage.setItem("currentContext", a.id)
                                    fetch(import.meta.env.VITE_URL + `/player/${a.id}`, {
                                        method: 'POST',
                                        credentials: "include",
                                        headers: {"Content-Type":"application/json"},                                        
                                    })
                                }}>
                                    <p>{a.name}</p> 
                                </a> 
                            )}
                        </div>
                    </Modal>                                
                </div>                
            </div>
        </>
    )
}