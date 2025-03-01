//session storage variable p_image created here for fetch purpose
//Session storage vars ref_id and ref_items created here

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Loading2 from "../components/Loading2/Loading2.tsx"
import './Categories.css'
import { Spin } from "../components/Spin/Spin.tsx";
import { useGetPlaylistsQuery } from "../App/ApiSlice.ts";

function randColor(){
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
}
function isLight(color:any) {
    // Convert hex color to RGB values
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
  
    // Calculate luminance using the relative luminance formula
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  
    // Return true if light, false if dark
    return luminance > 127.5;
}



export default function Categories({active, paused}: any) {
    const navigate = useNavigate()
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    const [clists, setClists] = useState<any>(null);
    const [loading, setLoading] = useState(false)
    const {data: playlists = []} = useGetPlaylistsQuery()    
    

    useEffect (() => {
        if (sessionStorage.getItem("ref_id") === lastSegment) {
            setClists(JSON.parse(sessionStorage.getItem("ref_items")!))
          }
        else{
        const fetchcPlaylists = async () => {
            setLoading(true)
            const resp = await fetch(import.meta.env.VITE_URL + `/cplaylists/${lastSegment}`)
            const data = await resp.json()
            setLoading(false)
            // let reader = resp.body?.getReader()
            // let result
            // let temp
            // let a = []
            // let decoder = new TextDecoder('utf8')
            // while(!result?.done){
            //     result = await reader?.read()
            //     let chunk = decoder.decode(result?.value)
            //     console.log(chunk ? JSON.parse(chunk) : {})
            //     chunk ? (
            //     temp = JSON.parse(chunk).playlists,
            //     a.push(...temp),  
            //     setClists([...a]) )
            //     : (sessionStorage.setItem("ref_id", lastSegment!),  sessionStorage.setItem("ref_items", JSON.stringify(a)))
                
            // }
            console.log(data)
            setClists(data)
            
        }
        fetchcPlaylists()
    }
    }, []);

    const listPlaylists = clists?.map((a: any) =>
        <a onClick={function handleClick() {            
            var parts = a.uri.split(':');
            var lastSegment = parts.pop() || parts.pop();

            let found = playlists?.find((e: any) => e?.playlist_id === a.playlist_id)
            console.log(found)
            console.log(a.playlist_id)
            found === undefined ? sessionStorage.setItem("uplist", "false") : sessionStorage.setItem("uplist", "true")

            sessionStorage.setItem("p_image", a.images.map((s: any) => s.uri))
            sessionStorage.setItem("playlist_name", a.name)
            sessionStorage.setItem("cplaylist", JSON.stringify(a.tracks))
            navigate(`/app/playlist/${lastSegment}`)
        }}>
            <div className="card" style={{background: randColor()}}>

            <img className="cCardImg" src={a.images.map((s: any) => s.uri)} alt="Avatar"/>
            <div className="container" style={{display: 'flex', justifyContent: 'center'}}>
                <h4 style={isLight(randColor()) ? {color: 'black'} : {color: 'white'}} ><b>{a.name}</b></h4>
                {/* <p><b>{a.description}</b></p> */}
            </div>

            </div>
        </a>
    )
    
    return (
      <>
      {Spin(active,paused,sessionStorage.getItem("c_icon")!,null)}
      {/* <img className="fade-in-image" src={sessionStorage.getItem("c_icon")!} style={{height: '300px'}}/> */}
      <h2 className="catHeader" >{sessionStorage.getItem("c_name")}</h2>
      {loading ? <Loading2 yes={true} /> : (
        <>
        
        <div style={{
            display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingTop: '15px',
        }}>
            {listPlaylists}
        </div>
        </>
        )}
      </>
    )
}