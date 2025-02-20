//session storage c_icon, c_name variable created here; use for categories playlist click

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card/Card";
import './Discover.css'
import ButtonScroll from "../components/ButtonScroll/ButtonScroll";

function customRender(name: any, item: any){
    return (
        <>
            <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{name}</h2>
            <div className={name} style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingTop: '15px',                                                                                                                                                                                                          
            }}>
                {item}
            </div>
        </>
        
    )
}

export default function Discover() {
    const navigate = useNavigate()

    const [releases, setReleases] = useState<any>([])
    const [categories, setCategories] = useState([])
    // const [fplaylists, setFplaylists] = useState<any>([])
    const [albums, setAlbums] = useState([])
    const [loading, setLoading] = useState(true)    

    useEffect (() => {        
        const rel = sessionStorage.getItem("releases")
        const cat = sessionStorage.getItem("categories")
        const fplay = sessionStorage.getItem("fplaylists")
        if (rel && cat && fplay){
            setReleases(JSON.parse(rel));
            setCategories(JSON.parse(cat))
            console.log(JSON.parse(cat))
            // setFplaylists(JSON.parse(fplay))
            setLoading(false)
        }

        else {
            const fetchCategories = async () => {
                const resp = await fetch(import.meta.env.VITE_URL + '/categories')
                const data = await resp.json()
                setAlbums(data.hipster)
                setCategories(data.categories)
                console.log(data)
                sessionStorage.setItem("categories", JSON.stringify(data))
                setLoading(false)
            }
            fetchCategories()

            const fetchDiscover = async () => {
                try {
                    var temp = await fetch(import.meta.env.VITE_URL + '/discover')
                .then((res) => {
                    return res.json();
                }).then((data) => {return data})
                    return temp
                }
                catch (err) {}
            }
            const assignDiscover = async () => {
            const tempDiscover = await fetchDiscover()
            setReleases(tempDiscover.releases)
            // setFplaylists(tempDiscover.fplaylists)
                
            sessionStorage.setItem("releases", JSON.stringify(tempDiscover.releases))
            // sessionStorage.setItem("fplaylists", JSON.stringify(tempDiscover.fplaylists))
            
            }
            assignDiscover()
        }

    }, []);

    const listAlbums = albums?.map((a:any, i:any) =>
        <a style={{height: '270px'}} key={i} onClick={function handleClick() {
            sessionStorage.setItem("albumStatus", "notuser")
            sessionStorage.setItem("image", a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url))
            let temp = a.artists.map((a:any) => a.name)
            sessionStorage.setItem("artist", JSON.stringify(temp))
            temp = a.artists.map((b:any) => b.id)
            sessionStorage.setItem("artist_id", JSON.stringify(temp))
            navigate(`/app/album/${a.album_id}`)        
            
        }}>
            <div className="categoryContainer" style={{width: '200px',height: '305px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                <img className="fade-in-image" src={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
                <h4 style={{marginTop: '200px', maxWidth: '150px'}} ><b>{a.name}</b></h4>
                
            </div>
        </a>
    )

    const listCategories = categories?.map((a: any, i: any) =>
        <a key={i} onClick={function handleClick() {
            sessionStorage.setItem("c_icon", a.icons.map((s: any) => s.url))
            sessionStorage.setItem("c_name", a.name)
            navigate(`/app/categories/${a.name.toLowerCase().replaceAll(' ','').replace('-','').replace('&','and')}`)        
            
        }}>
            <div className="categoryContainer" style={{width: '200px',height: '305px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                <img className="fade-in-image" src={a.icons.map((s: any) => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
                <h4 style={{marginTop: '200px'}} ><b>{a.name}</b></h4>
                
            </div>
        </a>
        
    )

    const listReleases = releases.albums?.items.map((a: any) => 
        <Card
          key={a.id}
          id={a.id}
          uri={a.uri}
          image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
          name={a.name}
          artist={a.artists.map((t: any) => t.name)}
          a_id={a.artists.map((t: any) => t.id)}
        />
      )
    // const listPlaylists = fplaylists.playlists?.items.map((a: any, i: any) =>
    //     <a key={i} onClick={function handleClick() {
    //         sessionStorage.setItem("p_image", a.images.map((s: any) => s.url))
    //         sessionStorage.setItem("playlist_name", a.name)
    //         navigate(`/app/playlist/${a.id}`)
    //     }}>
    //         <div className="card" style={{width: '200px',height: '285px', marginBottom: '50px', background: a.primary_color}}>

    //             <img src={a.images.map((s: any) => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
    //             <div className="container">
    //                 <h4><b>{a.name}</b></h4>
    //                 <p><b>{a.description}</b></p>
    //             </div>

    //         </div>
    //     </a>
    // )


    return (
        <>
        { loading ? null :
        <div className="discoverContainer" style={{width: '90vw', position: 'absolute', left: '5vw', top: '9vw'}}>   
            {/* {customRender("Check These Out", listAlbums)}  */}
            <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >Check These Out</h2>
            <div className="scroll-container" >
                <div className="carousel-primary" >
                {listAlbums}
                {listAlbums}
                </div>                                                         
            </div>
            
            {customRender("Categories", listCategories)}
            {customRender("New Releases", listReleases)}
            {/* {customRender("Popular Playlists", listPlaylists)}   */}
            <ButtonScroll />      
        </div>
         }         
        </>
    )
}