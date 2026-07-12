//session storage c_icon, c_name variable created here; use for categories playlist click
import './Discover.css'
import { useState, useEffect, useContext, useRef } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Spin3 } from "../components/Spin/Spin";
import Card from "../components/Card/Card";
import { spotifyRequest } from '../utils/utils.ts';
import { useAppDispatch } from '../App/hooks.ts';
import { setCurrentAlbum } from '../App/defaultSlice.ts';
import InfiniteObserver from '../helpers/InfiniteObserver.tsx';
import { useResponsive } from '../hooks/ResponsiveContext.tsx';

export default function Discover() {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [releases, setReleases] = useState<any>([]);
    const [categories, setCategories] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);

    const {playerState} = useContext(UsePlayerContext);

    const {isMobile} = useResponsive();

    const selectorRef = useRef(null);

    const [counter, setCounter] = useState(0);    

    const fetchDiscover = async () => {
        try {                    
            const data = await spotifyRequest(`/discover?offset=${counter}`);                        
            //return data;

            setReleases((prev: []) => [...prev, ...data]);                                    
            //sessionStorage.setItem("releases", JSON.stringify(data));   
            setCounter((prev: number) => prev += 40);                
            setLoading2(false);
        }
        catch (err) {
            console.error(err);                    
        }
    };

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
                try{
                    const data = await spotifyRequest('/categories');  
                                      
                    setAlbums(data.hipster);                    
                    setCategories(data.categories);                    
                    //sessionStorage.setItem("categories", JSON.stringify(data));
                    setLoading(false);
                }
                catch (e){
                    console.error(e);
                }                          
            }
            fetchCategories();

            // const fetchDiscover = async () => {
            //     try {                    
            //         const data = await spotifyRequest(`/discover?offset=${counter}`);            
            //         //return data;

            //         setReleases((prev: []) => [...prev, ...data]);                                    
            //         sessionStorage.setItem("releases", JSON.stringify(data));   
            //         counter += 40;    
            //         setLoading(false);
            //     }
            //     catch (err) {
            //         console.error(err);                    
            //     }
            // }
            // const assignDiscover = async () => {
            //     const tempDiscover = await fetchDiscover();                
            //     //setReleases(tempDiscover);
            //     setReleases((prev: []) => [...prev, ...tempDiscover]);                                    
            //     sessionStorage.setItem("releases", JSON.stringify(tempDiscover));   
            //     counter += 40;    
            //     setLoading(false);                 
            // }
            // assignDiscover();

            fetchDiscover();
        }

        return () => {setCounter(0);}
    }, []);

    const title = (title: string) => {
        return (
            <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{title}</h2>
        );
    };

    const listAlbums = albums?.map((album:any, index:any) =>
        <a key={index} onClick={function handleClick() {
            dispatch(setCurrentAlbum({
                image: album.images.filter((t: any)=>t.height == 300).map((s: any) => s.url),
                artists: album.artists.map((a:any) => a.name),
                artist_ids: album.artists.map((b:any) => b.id),
            }));

            navigate(`/app/album/${album.album_id}`)                    
        }}>
            <div className="categoryContainer" style={{width: '200px',height: '305px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img className="fade-in-image" src={album.images.find((t: any) => t.height == 300)?.url} alt="Avatar" style={{width:'155px',height:'190px',borderRadius: '10px'}}/>

                <h4 className="discoverCHeader"><b>{album.name}</b></h4>                
            </div>
        </a>
    );

    const categoryContainer = () => {
        return (
            <>
                {title("Categories")}

                <div 
                    className="Categories" 
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        paddingTop: '15px',                                                                                                                                                                                                          
                    }}
                >
                    {listCategories}
                </div>
            </>
        );
    };

    const listCategories = categories?.map((a: any, index: any) =>
        <div className='categoryContainer' key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: !isMobile ? '0px 5px 20px 5px' : '0px 5px 70px 5px'}}>
            <span style={{color: 'white', fontSize: !isMobile ? '18px' : '13px'}}><b>{a.name}</b></span>

            <a                  
                onClick={(() => {
                    sessionStorage.setItem("c_icon", a.icons.map((s: any) => s.url))
                    sessionStorage.setItem("c_name", a.name)
                    navigate(`/app/categories/${a.name.toLowerCase().replaceAll(' ','').replace('-','').replace('&','and')}`)        
                    
                })}
            >
                <img className="iconImage" src={a.icons.map((s: any) => s.url)} alt="Avatar" style={{width: '155px', height: '190px', borderRadius: '10px'}}/>
            </a>
        </div>
    )

    const listReleases = releases?.map((a: any, index: number) => 
        <div key={index}>
            <h5>{a.release_date}</h5>

            <Card            
                id={a.id}
                uri={a.uri}
                image={a.images.find((image: any) => image.height == 300)?.url}
                name={a.name}
                artist={a.artists.map((t: any) => t.name)}
                a_id={a.artists.map((t: any) => t.id)}
                paused={playerState.is_paused}
            />
        </div>
    );

    const displayWrap = () => {        
        const chunkedArray = [];

        for (let i = 0; i < releases?.length; i += 10) {
            chunkedArray.push(releases.slice(i, i + 10));
        }

        return (
            <>
                <h2 style={{margin: '25px auto'}} >New Releases</h2>

                {chunkedArray.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((item: any, itemIndex: any) => (
                            <div key={itemIndex} className="item">
                                <h5>{item.release_date}</h5>

                                <Card
                                    // key={a.id}
                                    id={item.id}
                                    uri={item.uri}
                                    image={item.images.find((image: any) => image.height == 300)?.url}
                                    name={item.name}
                                    artist={item.artists.map((artist: any) => artist.name)}
                                    a_id={item.artists.map((artist: any) => artist.id)}
                                />                                
                            </div>
                        ))}
                    </div>
                ))}
            </>
        );        
    };

    const scrollContent = () => {
        return (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingTop: '15px',                                                                                                                                                                                                          
                }}
            >
                {!isMobile ? listReleases : displayWrap()}
            </div>
        );
    };
    
    return (
        <>        
            {loading ? Spin3() :        
                <div 
                    className="discoverContainer" 
                    style={{width: '90vw', position: 'absolute', left: '5vw', top: '9vw', paddingBottom: '200px', height: '100%'}}
                >                   
                    {title("Check These Out")}

                    <div className="scroll-container" >
                        <div className="carousel-primary">
                            {listAlbums}

                            {listAlbums}
                        </div>                                                         
                    </div>

                    {categoryContainer()}                                        

                    <div ref={selectorRef.current}>
                        {title("New Releases")}

                        <InfiniteObserver
                            root={selectorRef.current}
                            //spinner={true}
                            spin3={true}
                            spinnerStyle={{mainColor: "red", sideColor: "white", size: "40px"}}
                            style={{display: "flex", flexDirection: "column", alignItems: "center"}}
                            rootMargin="300px"
                            disabled={loading2 || !listReleases.length}
                            onIntersect={async (obj: IntersectionObserverEntry) => {
                                setLoading2(true);                                                                                        
                                
                                await fetchDiscover();                                    

                                setLoading2(false);                
                            }}
                        >
                            {scrollContent()}
                        </InfiniteObserver>                            
                    </div>                                                          
                </div>
            }         
        </>
    );
};