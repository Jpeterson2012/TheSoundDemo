//session storage variable name set here
import './PTrack.css'
import SavedSong from "../SavedSong/SavedSong.tsx"
import musicBar from '../musicBar/musicBar.tsx';

function timeCalc (ms: number) {
    const temp = Math.round(ms / 1000)
    let mins = Math.floor(temp / 60)
    let secs = temp - mins * 60
    secs > 59 ? (mins += 1, secs -= 60) : null
    secs.toString().length === 1 && secs > 5 ? (mins += 1, secs -= 6) : null
    if (secs.toString().length == 1) return `${mins}:${secs}0`
    else return `${mins}:${secs}`
}

export default function PTrack ( {uri, name, number, duration, liked, artist, t_uri, rplay,paused}: any ) {
    
    const artists = JSON.parse(sessionStorage.getItem("currentTrack")!)
    return (
        <div className='pTrackContainer' style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <a onClick={function handleClick () {
                                                
                sessionStorage.setItem("name", sessionStorage.getItem("playlist_name")!)
                if (sessionStorage.getItem("currentContext")! === null || sessionStorage.getItem("currentContext")! === "null"){
                    var url = `https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
                }
                else{
                    var url = `https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("currentContext")}`
                }
                
                    const headers = {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer ' + sessionStorage.getItem("token")
                    }
                    try{
                    fetch(url, {
                        method: 'PUT',
                        headers: headers,                        
                        /* Old method of playling playlist using playlist uri. doesnt work with sorting */
                        // body: liked !== null ? JSON.stringify({uris: liked, offset: {position: number}}) : JSON.stringify({context_uri: uri, offset: {position: number}})
                        body: JSON.stringify({uris: liked, offset: {position: number}})
                    })
                    }
                    catch(e) {console.log(e)}
                
            }}>
            <div>            
                <div className="ptrackInfo">
                    <div style={{display: 'flex'}} >
                        {!paused ? <span className="pMusic">{(sessionStorage.getItem('current') === t_uri) ? musicBar() : null}</span> : null}
                        <h2 className="ptrackName">{name}</h2>
                    </div>                    
                    <h4 className="ptrackArtist">{artist?.map((a: any,i: number,row: any) => row.length - 1 !== i ? a.name + ", " : a.name)}</h4>
                </div>
            </div>
            
            </a>
            <div style={{display: 'flex'}} >{rplay ? <SavedSong track={t_uri} /> : null}<span className="ptrackDur">{timeCalc(duration)}</span></div>
      </div>
    )
}