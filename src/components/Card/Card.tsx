//session storage variables id, uri, image, albumname, and artist are set here
import './Card.css'
import { useNavigate } from 'react-router-dom';
import { useGetAlbumsQuery } from '../../App/ApiSlice.ts';
import Loading3 from '../Loading3/Loading3.tsx';

import { useAppDispatch } from '../../App/hooks.ts';
import { setCurrentAlbum } from '../../App/defaultSlice.ts';

export default function Card( {id, image, name, artist, a_id, paused}: any ) {    
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    let key: number = 0;
    //This is for displaying multiple artists with their own spotify ids
    let zip = artist.map((e: any, i: number) => {
        return [e, a_id[i]];
    });

    const {data: albums = []} = useGetAlbumsQuery();

    let found = albums?.find((e: any) => e?.album_id === id);

    return (
        <div className="card">
            {(!paused && sessionStorage.getItem('name') === name) && <Loading3/>}
            <a onClick={() => {
                dispatch(setCurrentAlbum({
                    image,
                    artists: artist,
                    artist_ids: a_id,
                }));
                
                navigate(`/app/album/${id}`);
            }}> 
                <img className='cardImg' src={image} alt="Avatar"/>
            </a>

            <div>
                <div className='mainArtistContainer'>
                    {zip.map((s: any,i: any, row: any) =>
                        <div className='cardArtistContainer' key={i}>
                            <a 
                                onClick={() => {
                                    s[0] !== 'Various Artists' && navigate(`/app/artist/${s[1]}`);
                                }} 
                                className='cardArtist'
                            >
                                {row.length - 1 !== i ? s[0] + ", " : s[0]}
                            </a>
                            <span hidden>{key++}</span>
                        </div>
                    )}
                </div>                
                    
                <p className='cardName'><b>{name}</b></p>
            </div>        
        </div>
    );
};