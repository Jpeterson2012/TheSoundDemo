//session storage variable name set hereimport musicBar from "../musicBar/musicBar.tsx"
//import './Track.css';
import styles from './Track.module.css'; 
import { useEffect, useState } from "react";
import SavedSong from '../SavedSong/SavedSong';
import musicBar from '../musicBar/musicBar.tsx';
import { spotifyRequest, timeCalc, getRandomInt } from '../../utils/utils.ts';
import { useResponsive } from '../../hooks/ResponsiveContext.tsx';

export default function Track ( {uri, name, number, duration, album_name, artist, t_uri, show = true, customWidth, paused}: any) {
    const [plays, setPlays] = useState<string>("1,000,000");

    const currentlyPlaying = (sessionStorage.getItem('current') === t_uri);

    const {isMobile} = useResponsive();

    useEffect(() => {
        setPlays(getRandomInt(1000000, 10000000));
    }, []);

    return (
        <div 
            className={styles.trackContainer} 
            style={{
                ...(customWidth ? {width: `${customWidth}%`} : {width: '100%'}), 
                ...(show === undefined && {borderBottom: '1px solid rgba(90, 210, 216, 0.3)'})
            }}
        >
            <a 
                onClick={() => {                
                    album_name && sessionStorage.setItem("albumname", album_name);
                    
                    // sessionStorage.setItem("name", sessionStorage.getItem("albumname"))
                    const deviceId = sessionStorage.getItem([null, "null"].includes(sessionStorage.getItem("currentContext")) ? "device_id" : "currentContext");

                    spotifyRequest(`/player/playback/${deviceId}`, 'POST', {
                        body: JSON.stringify({context_uri: uri, offset: {position: number - 1}})
                    });
                }}
            >                            
                <div className={styles.innerMain}>
                    <div style={{display: 'flex', alignItems: 'center', gap: currentlyPlaying ? '2px' : '0px'}}>
                        {!paused && <span className={styles.tMusic}>{currentlyPlaying && musicBar()}</span>}

                        <span className={styles.innerMainName} style={currentlyPlaying ? {color: 'rgb(90, 210, 216)'} : {}}>{name}</span>
                    </div>                    

                    <h4>{artist.map((a: any,index: number,row: any) => row.length - 1 !== index ? a.name + ", " : a.name)}</h4>                            
                </div>
                
                <br></br>            
            </a>

            {(show && !isMobile && !customWidth) && <span style={{position: 'absolute', color: 'rgb(90, 210, 216)', top: '25%', left: '60%', fontWeight: 'bold'}} >{plays}</span>}

            {show && <div style={{display: 'flex'}}><SavedSong track={t_uri} /><span className={styles.songLength}>{timeCalc(duration)}</span></div>}
      </div>
    );
};