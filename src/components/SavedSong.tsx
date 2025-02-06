import { useGetLikedQuery, useGetPlaylistsQuery } from "../App/ApiSlice";
import { useEffect } from "react";

export default function SavedSong({track}:any){
    const {data: liked} = useGetLikedQuery()
    const {data: playlists} = useGetPlaylistsQuery()
    let found: boolean = false

    useEffect(() => {

    },[])

    if (liked?.tracks.find((e:any)=>e.uri === track) !== undefined) found = true

    if (!found)
        for (let i = 0; i < playlists!.length; i++){            
            playlists![i].tracks?.find((e:any)=>e.uri === track) !== undefined ? 
            found = true : null
            if (found === true) break
        }        
    return (
        <div style={found ? {backgroundColor: 'rgb(90, 210, 216)', marginRight: '20px', width: '29px', height: '29px', borderRadius: '50%'} : {backgroundColor: '', marginRight: '', width: '', height: '', borderRadius: ''}}>
            <div style={{color: "#7a19e9", fontSize: '20px'}}>{found ? "✓" : null}</div>
        </div>
    )
}