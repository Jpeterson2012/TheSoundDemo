//session storage variable name set here
import './PTrack.css'
import SavedSong from "../SavedSong/SavedSong.tsx"
import musicBar from '../musicBar/musicBar.tsx';
import { spotifyRequest, timeCalc } from '../../utils/utils.ts';

export default function PTrack ( {uri, name, number, duration, liked, artist, t_uri, rplay,paused}: any ) {     
    const currentlyPlaying = (sessionStorage.getItem('current') === t_uri);
    
    return (
        <div className='pTrackContainer' style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <a 
                onClick={() => {                                                
                    sessionStorage.setItem("name", sessionStorage.getItem("playlist_name")!);
                    
                    const deviceId = sessionStorage.getItem([null, "null"].includes(sessionStorage.getItem("currentContext")) ? "device_id" : "currentContext");

                    spotifyRequest(`/player/playback/${deviceId}`, 'POST', {
                        body: JSON.stringify({uris: liked, offset: {position: number}})
                    });
                    
                }}
            >                            
                <div className="pInnerMain">
                    <div style={{display: 'flex', alignItems: 'center', gap: currentlyPlaying ? '2px' : '0px'}} >
                        {!paused && <span className="pMusic">{currentlyPlaying && musicBar()}</span>}

                        <div className="pInnerMainName" style={currentlyPlaying ? {color: 'rgb(90, 210, 216)'} : {}}>{name}</div>
                    </div>                    

                    <h4 className="ptrackArtist">{artist?.map((artist: any) => artist.name).join(', ')}</h4>
                </div>                
            
            </a>

            <div style={{display: 'flex'}} >{rplay && <SavedSong track={t_uri}/>}<span className="pSongLength">{timeCalc(duration)}</span></div>
      </div>
    );
};