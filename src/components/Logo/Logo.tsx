import logo from '../../images/logo.png'
import './Logo.css'
import { useNavigate } from 'react-router-dom'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useState, useEffect } from 'react';
import Track from '../Track/Track';
import escape from '../../images/escape.jpg'
import search from '../../images/search.png'
import space from '../../images/music.gif'
import { useGetUserQuery,useGetAlbumsQuery, useGetPlaylistsQuery } from '../../App/ApiSlice';

function getTracks(ptracks: any) {
    var key = 0
    return (
      ptracks.map((t:any, i:any) =>
  
        <div className='logoTracks' style={{display: 'flex', alignItems: 'center', fontSize: '20px'}} key={i}>
            
            <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px', width: '64px'}}/>
            <Track 
            uri={t.url}
            name={t.name}
            number={t.track_number}
            duration={t.duration_ms}
            album_name={t.album_name}
            artist={t.artists}
            show={false}
            />
          <p hidden>{key++}</p>
        </div>
      )
    )
  }
  function getAlbums(albumss: any,palbums: any, nav: any, close: any) {
    var artists: any = []
    var a_ids: any = []
    
    return (
      palbums.map((t:any) =>
        <a key={t.id} onClick={function handleClick() {
          //Check if album is already in library or not
          let found = albumss?.find((e: any) => e?.album_id === t.id)
          found === undefined ? sessionStorage.setItem("albumStatus", "notuser") : sessionStorage.setItem("albumStatus","user")

            t.artists.map((s:any) => artists.push(s.name))
            t.artists.map((s:any) => a_ids.push(s.id))
            sessionStorage.setItem("artist", JSON.stringify(artists))
            sessionStorage.setItem("artist_id", JSON.stringify(a_ids))
            sessionStorage.setItem("image", t.images.filter((t:any) => t.height == 300).map((s:any) => s.url))
            nav(`/app/album/${t.id}`)
            close()
        }}>
            <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
                <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px'}}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <div>{t.name}</div>
                <div>{t.artists.map((a:any) => a.name + " ")}</div>
                </div>
                
            </div>
        </a>
      )
      
    )
  }
  function getArtists(partists: any, nav: any, close: any){
    return (
      partists.map((a:any) => 
        <a key={a.id} onClick={function handleClick() {
          nav(`/app/artist/${a.id}`)
          close()
        }}>
      <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
      {/* <img src={a.images?.length == 1 ? a.images?.map(s => s.url) : a.images?.filter(s => s.height == 160).map(s => s.url)} alt={a.name} style={{height: '64px', width: '64px'}}/> */}
      <img src={a.images?.length == 0 ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' : a.images[2]?.url} alt={a.name} style={{height: '64px', width: '64px'}} />
        {a.name}
        </div>
        </a>
      )
    )
  }
  function getPlaylists(plistss:any,plists: any, nav: any, close: any){
    return (
      plists.map((a:any) =>
      <div key={a.id}>

      <a onClick={function handleClick() {
        sessionStorage.removeItem("cplaylist")
        let found = plistss?.find((e: any) => e?.playlist_id === a.id)
        found === undefined ? sessionStorage.setItem("uplist", "false") : sessionStorage.setItem("uplist", "true")
        sessionStorage.setItem("playlist_name", a.name)
        sessionStorage.setItem("fullp_image", JSON.stringify(a.images))
        sessionStorage.setItem("p_image", a.images.length == 1 ? a.images.map((s:any) => s.url) : a.images.filter((s:any) => s.height == 60).map((s:any) => s.url))
        nav(`/app/playlist/${a.id}`)
        close()
      }}>
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
        <img src={a.images?.length == 1 ? a.images?.map((s:any) => s.url) : a.images?.filter((s:any) => s.height == 60).map((s:any) => s.url)} alt={a.name} style={{height: '64px', width: '64px'}}/>
        {a.name}
        </div>
      
      <br></br>
      </a>
      
    </div>
      )
    )
  }

let counter = 0

export default function Logo () {
    const navigate: any = useNavigate()

    const [html, setHtml] = useState<any>(null)
    const [tracks, setTracks] = useState<any>([]);
    const [albums, setAlbums] = useState<any>([]);
    const [plist, setPlist] = useState<any>([]);
    const [artist, setArtist] = useState<any>([])
    const {data: albumss = []} = useGetAlbumsQuery()
    const {data: playlists = []} = useGetPlaylistsQuery()    

    const [open, setOpen] = useState(false);        
    const onOpenModal = () => {setOpen(true)};
    const onCloseModal = () => {setOpen(false); setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0};

    const fetchSearch = async () => {        
      try {
        var temp = fetch(import.meta.env.VITE_URL + `/search/${(document.getElementById("searchTerm") as HTMLInputElement).value},${counter}`,{credentials: "include"})
      .then((res) => {
        // console.log(res.json())
        return res.json();
      }).then((data) => {
        if (counter !== 0){
        setTracks([...tracks,...data.tracks])
        setAlbums([...albums,...data.albums])
        setArtist([...artist,...data.artists])
        setPlist([...plist,...data.playlists])
        }
        else{
          setTracks([...data.tracks])
          setAlbums([...data.albums])
          setArtist([...data.artists])
          setPlist([...data.playlists])
        }
      })
        return temp
      }
      catch (err) {console.log(err)}               
    }

    const closeIcon = (
        <img src={escape} style={{height: '44px', width: '44px'}}/>
      );
    const {data: user,isSuccess} = useGetUserQuery()    
    
    useEffect(() => {         
      isSuccess && sessionStorage.setItem("username", user.items)      
      switch(sessionStorage.getItem('searchHome')){
        case 'tracks':
          setHtml(getTracks(tracks))
          break
        case 'albums':
          setHtml(getAlbums(albumss,albums, navigate, onCloseModal))
          break
        case 'artists':
          setHtml(getArtists(artist, navigate, onCloseModal))
          break
        case 'playlists':
          setHtml(getPlaylists(playlists,plist, navigate, onCloseModal))
          break
        // case 'local':
        //   setHtml(localSong())
        //   break
        default:
          setHtml(getTracks(tracks))
      }
    }, [tracks])

    return(
        <>
          {!isSuccess ? null :
          <div className='mainLogo'>
              <h2 className='userName'>{isSuccess ? user!.items : 'hi'}</h2>
              <div className='u2Container' style={{backgroundColor: 'rgb(90, 210, 216)', width: '29px', height: '29px', borderRadius: '50%'}}>
              <h2 className='userName2'>{isSuccess ? user!.items[0] : 'hi'}</h2>
              </div>
              

              <h2 className='navIcon1' onClick={function handleClick(){
                if (window.history?.length && window.history.length > 1) navigate(-1, {replace: true})
                else navigate('/app/', {replace: true})
              }}>{"<"}</h2>

              <img className='searchimg' src={search} onClick={function handleClick(){onOpenModal()}} />

              <h2 className='navIcon2' onClick={function handleClick(){
                if (window.history?.length && window.history.length > 1) navigate(1, {replace: true})
                  else navigate('/app/', {replace: true})
              }}>{">"}</h2>
              
                  <h2 className='Discover' onClick={function handleClick() {navigate('/app/discover')}} >Discover</h2>   
                             
              <a onClick={function handleClick() {navigate('/app')}}>
                  <img className='logoIcon' src={logo} alt="Avatar" onClick={function handleClick() {navigate('/app')}}/>
              </a>



              <div>
                <div>
                  
                </div>

                  <Modal modalId='modal3' open={open} onClose={onCloseModal} center closeIcon={closeIcon}>
                  

                  <div className="wrap">
                  <div className="search">
                      <input type="text" className="searchTerm" id='searchTerm'  placeholder="What are you looking for?" />
                      <button type="button" className="searchButton" onClick={function handleSubmit(){
                        

                        setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0;

                        // console.log((document.getElementById("searchTerm") as HTMLInputElement).value);
                        let t = document.getElementById('modalbuttons')!
                        t.style.display = 'flex'
                        t.style.animation = 'fadeIn 0.5s'

                        fetchSearch()
                         return false
                      }}><i className="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}} ></i></button>
                      </div>
                      </div>
                      <img src={space} style={{zIndex: '0', width: '100%', height: '180px', position: 'fixed', top: '0', opacity: '0.3', objectFit: 'cover', objectPosition: '20% 50%'}} />


                      <div id='modalbuttons' style={{display: 'none', justifyContent: 'center', zIndex: '9', position: 'relative', marginTop: '8vw'}}>
                          <button onClick={() => {setHtml(getTracks(tracks)), sessionStorage.setItem('searchHome', 'tracks')}}>Tracks</button>
                          <button onClick={() => {setHtml(getAlbums(albumss,albums, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'albums')}}>Albums</button>
                          <button onClick={() => {setHtml(getArtists(artist, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'artists')}}>Artists</button>
                          <button onClick={() => {setHtml(getPlaylists(playlists,plist, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'playlists')}}>Playlists</button>
                      </div>

                      <div className='logoModal' style={{maxWidth: '55vw', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', marginTop: '40px'}}>{html ? html : getTracks(tracks)}</div>


                      {tracks.length > 0 ? <button onClick={function handleSubmit(){
                        counter += 10
                        fetchSearch()
                      }} style={{width: '100%', marginTop: '10px', height: '54px', fontSize: '25px', fontWeight: 'bolder'}} >Load More</button> : null}                      
                  </Modal>
              </div>
          </div>
          }
        </>
    )
}


