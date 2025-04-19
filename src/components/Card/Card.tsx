//session storage variables id, uri, image, albumname, and artist are set here

import './Card.css'
import { useNavigate } from 'react-router-dom';
import { useGetAlbumsQuery } from '../../App/ApiSlice.ts';

export default function Card( {id, image, name, artist, a_id}: any ) {
    const navigate = useNavigate()
    let key: number = 0
    //This is for displaying multiple artists with their own spotify ids
    let zip = artist.map(function (e: any, i: number) {
        return [e, a_id[i]]
    })
    const {data: albums = []} = useGetAlbumsQuery()
    let found = albums?.find((e: any) => e?.album_id === id)
    return (
        <div className="card">

            <a onClick={function handleClick() {
                //Check if album is already in library or not
                found === undefined ? sessionStorage.setItem("albumStatus", "notuser") : sessionStorage.setItem("albumStatus","user")
                sessionStorage.setItem("id", id)
                // sessionStorage.setItem("uri", uri)
                sessionStorage.setItem("image", image)
                sessionStorage.setItem("albumname", name)
                sessionStorage.setItem("artist", JSON.stringify(artist))
                sessionStorage.setItem("artist_id", JSON.stringify(a_id))
                
                navigate(`/app/album/${id}`)
            }}> <img className='cardImg' src={image} alt="Avatar"/>
            </a>

            <div>

            <div className='mainArtistContainer' >{zip.map((s: any,i: any,row: any) =>
                <div className='cardArtistContainer' key={i}>
                <a onClick={function handleClick() {
                    s[0] === 'Various Artists' ? null : navigate(`/app/artist/${s[1]}`)
                }} className='cardArtist'>{row.length - 1 !== i ? s[0] + ", " : s[0]}</a>
                <span hidden>{key++}</span>
                </div>
            )}</div>

            <div className='mainArtistContainer2'><b>
                <div className='cardArtistContainer' key={zip[1]}>
                <a onClick={function handleClick() {
                    zip[0][0] === 'Various Artists' ? null : navigate(`/app/artist/${zip[0][1]}`)
                }} className='cardArtist'>{zip[0][0]}</a>
                <span hidden>{key++}</span>
                </div>
            </b></div>                
                
            <p className='cardName'><b>{name}</b></p>

            </div>
        
        </div>
    );
}