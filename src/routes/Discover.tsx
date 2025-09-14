//session storage c_icon, c_name variable created here; use for categories playlist click
import './Discover.css'
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../contexts/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Spin3 } from "../components/Spin/Spin";
import Card from "../components/Card/Card";
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
    const [albums, setAlbums] = useState([])
    const [loading, setLoading] = useState(true)    

    const {playerState} = useContext(UsePlayerContext);

    useEffect (() => {        
        const rel = JSON.parse(sessionStorage.getItem("releases")!)
        const cat = JSON.parse(sessionStorage.getItem("categories")!)
        if (rel && cat){            
            setReleases(rel);
            setCategories(cat.categories)
            setAlbums(cat.hipster)            
            setLoading(false)
        }
        else {
            const fetchCategories = async () => {
                const resp = await fetch(import.meta.env.VITE_URL + '/categories', {credentials: "include"})
                const data = await resp.json()
                setAlbums(data.hipster)
                setCategories(data.categories)
                // console.log(data)
                sessionStorage.setItem("categories", JSON.stringify(data))
                setLoading(false)
            }
            fetchCategories()

            const fetchDiscover = async () => {
                try {
                    var temp = await fetch(import.meta.env.VITE_URL + '/discover', {credentials: "include"})
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
                sessionStorage.setItem("releases", JSON.stringify(tempDiscover.releases))                        
            }
            assignDiscover()
        }

    }, []);

    const listAlbums = albums?.map((album:any, index:any) =>
        <a key={index} onClick={function handleClick() {
            sessionStorage.setItem("albumStatus", "notuser")
            sessionStorage.setItem("image", album.images.filter((t: any)=>t.height == 300).map((s: any) => s.url))

            let temp = album.artists.map((a:any) => a.name)
            sessionStorage.setItem("artist", JSON.stringify(temp))

            temp = album.artists.map((b:any) => b.id)
            sessionStorage.setItem("artist_id", JSON.stringify(temp))
            navigate(`/app/album/${album.album_id}`)                    
        }}>
            <div className="categoryContainer" style={{width: '200px',height: '305px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img className="fade-in-image" src={album.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)} alt="Avatar" style={{width:'80%',height:'190px',borderRadius: '10px'}}/>
                <h4 className="discoverCHeader"><b>{album.name}</b></h4>                
            </div>
        </a>
    )

    const listCategories = categories?.map((a: any, index: any) =>
        <a key={index} onClick={function handleClick() {
            sessionStorage.setItem("c_icon", a.icons.map((s: any) => s.url))
            sessionStorage.setItem("c_name", a.name)
            navigate(`/app/categories/${a.name.toLowerCase().replaceAll(' ','').replace('-','').replace('&','and')}`)        
            
        }}>
            <div className="categoryContainer" style={{width: '200px',height: '305px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img className="fade-in-image" src={a.icons.map((s: any) => s.url)} alt="Avatar" style={{width:'80%',height:'190px',borderRadius: '10px'}}/>
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
          paused={playerState.is_paused}
        />
    )
    function displayWrap(){
        if (releases.albums){
            let array = releases?.albums?.items
            const chunkedArray = [];
            for (let i = 0; i < array.length; i += 10) {
                chunkedArray.push(array.slice(i, i + 10));
            }
            return (
                <>
                    <h2 style={{margin: '25px auto'}} >New Releases</h2>
                    {chunkedArray.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((item: any, itemIndex: any) => (
                                <div key={itemIndex} className="item">                                                            
                                    <Card
                                    // key={a.id}
                                    id={item.id}
                                    uri={item.uri}
                                    image={item.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
                                    name={item.name}
                                    artist={item.artists.map((t: any) => t.name)}
                                    a_id={item.artists.map((t: any) => t.id)}
                                    />                                
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            )
        }
    }
    
    return (
        <>        
        { loading ? Spin3() :        
            <div className="discoverContainer" style={{width: '90vw', position: 'absolute', left: '5vw', top: '9vw', paddingBottom: '200px'}}>                   
                <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >Check These Out</h2>
                <div className="scroll-container" >
                    <div className="carousel-primary">
                        {listAlbums}
                        {listAlbums}
                    </div>                                                         
                </div>
                
                {customRender("Categories", listCategories)}
                {window.innerWidth > 500 ? customRender("New Releases", listReleases) : displayWrap()}                
                <ButtonScroll />      
            </div>
        }         
        </>
    )
}