import { useGetLikedQuery, useGetPlaylistsQuery } from "../../App/ApiSlice";
import './SavedSong.css';

export default function SavedSong({track}:any){
    const {data: liked} = useGetLikedQuery();
    const {data: playlists} = useGetPlaylistsQuery();
    let found: boolean = false;

    if (liked?.tracks.find((e:any)=>e.uri === track) !== undefined) found = true

    if (!found && playlists !== undefined)
        for (let i = 0; i < playlists!.length; i++){            
            if (playlists![i].tracks?.find((e:any)=>e.uri === track) !== undefined) found = true;

            if (found) break;
        }        
    return (
        <div className={found ? "savedContainer" : "savedContainer2"}>
            <div className={found ? "subSaved" : "subSaved2"}>{found && "✓"}</div>
        </div>
    );
};