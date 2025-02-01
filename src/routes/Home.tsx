//sessionstorage items created: cusername, albums, playlist_name, sortVal, psortVal

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css'
import Card from "../components/Card/Card.tsx";
// import Local from "../components/Local/Local.jsx";
import { useGetAlbumsQuery, useGetPlaylistsQuery, useGetAudiobooksQuery, useGetPodcastsQuery, useDeleteAlbumMutation,useDeletePlaylistMutation } from "../App/ApiSlice.ts"; 
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import escape from '../images/escape.jpg'
import { Spin3 } from "../components/Spin/Spin.tsx";

import { imageRender } from "../components/ImageRender/ImageRender.tsx";
import MySnackbar from "../components/MySnackBar.tsx";

import dots from '../images/dots.png'

import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";

function generatePassword() {
  var length = 22,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function Albums(listItems: any){
  return(
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingTop: '15px',width: '90vw',position: 'absolute', left: '5vw', top: '16vw'
    }}>
      {listItems}
    </div>
  )
}
function albumSort(setSorted: any){
  return(
    <>
    <button className="theme" onClick={function handleClick(){
      setSorted(1)
      sessionStorage.setItem('sortVal','1')
    }}>A-Z</button>

    <button className="theme" onClick={function handleClick(){      
      setSorted(2)
      sessionStorage.setItem('sortVal','2')
    }}>Z-A</button>

    <button className="theme" onClick={function handleClick(){      
      setSorted(3)
      sessionStorage.setItem('sortVal','3')
    }}>Artist A-Z</button>

    <button className="theme" onClick={function handleClick(){      
      setSorted(4)
      sessionStorage.setItem('sortVal','4')
    }}>Artist Z-A</button>
    </>
  )
}
function Playlists(navigate: any, listPlaylists: any){
  return(
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      paddingTop: '5vw',
      marginBottom: '90px'
    }}>
      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", "Liked Songs")
        sessionStorage.setItem("uplist", "true")
        navigate('/app/playlist/likedsongs')
      }}>
      <div style={{display: 'flex', alignItems: 'center', animation: 'fadeIn 0.5s', marginLeft: '40px'}}>
        <img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>Liked Songs</h2>
      </div>
      </a>
    {listPlaylists}
    </div>
  )
}
function playlistSort(setPSorted: any){
  return(
    <>
      <button className="theme" onClick={function handleClick(){      
      setPSorted(1)
      sessionStorage.setItem('psortVal','1')
    }}>A-Z</button>

    <button className="theme" onClick={function handleClick(){      
      setPSorted(2)
      sessionStorage.setItem('psortVal','2')
    }}>Z-A</button>
    </>
  )
}
function Podcasts(podcasts:any){
  const listItems = podcasts?.items.map((a:any, i:any) =>
    <a key={i} onClick={function handleClick(){
      var url =`https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
      const headers = {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + sessionStorage.getItem("token")
      }
      
      fetch(url, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({context_uri: a.show.uri})
      })
    }}>
      <div style={{display: 'flex', alignItems: 'center'}}>
      < img className="fade-in-image" src={a.show.images.length == 1 ? a.show.images.map((s: any) => s.url) : a.show.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} alt={a.show.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>{a.show.name}</h2>
      </div>
      </a>
      )
  
  return(
    <div style={{marginTop: '10vw'}}>
      {listItems}
    </div>
    
  )
}
function Audiobooks(audiobooks:any){
  const listItems = audiobooks?.items.map((a:any,i:any) =>
      <a key={i} onClick={function handleClick(){        

        var url =`https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
        const headers = {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + sessionStorage.getItem("token")
        }
        
        fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({context_uri: a.uri})
        })
      }}>
      <div style={{display: 'flex', alignItems: 'center'}}>
      < img className="fade-in-image" src={a.images.length == 1 ? a.images.map((s: any) => s.url) : a.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} alt={a.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>{a.name}</h2>
      </div>
      </a>
      )
  
  return(
    <div style={{marginTop: '10vw'}}>      
      {listItems}
    </div>
    
  )
}
// function localSong(){
//   return(
//     <Local />
//   )
// }

export default function Home() {
    const navigate = useNavigate()
    const [html, setHtml] = useState<any>(null)
    const [sorted, setSorted] = useState(+sessionStorage.getItem('sortVal')!)
    const [psorted, setPSorted] = useState(+sessionStorage.getItem('psortVal')!)        
      
    const {data: albums = [],isSuccess: albumSuccess} = useGetAlbumsQuery()    
    const {data: podcasts, isSuccess: podSuccess} = useGetPodcastsQuery()
    const {data: audiobooks, isSuccess: audSuccess} = useGetAudiobooksQuery()    

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true)
    const [deleteAlbum, {isSuccess: delsuccess}] = useDeleteAlbumMutation()
    const [deletePlaylist] = useDeletePlaylistMutation()

    const[opensnack, setOpensnack] = useState(false)

    const onOpenModal = () => {setOpen(true)}
    const onCloseModal = () => {
      setOpen(false)
      let pform = document.getElementById('formPlaylist')
      pform?.addEventListener("submit", (e) => {
        e.preventDefault()
        let name = (document.getElementById('first') as HTMLInputElement)
        let desc = (document.getElementById('second') as HTMLInputElement)
        let opt1 = (document.getElementById('option1') as HTMLInputElement)
        // let opt2 = (document.getElementById('option2') as HTMLInputElement)
        if (name!.value == "") console.error("Error")
        else{
          let pID = generatePassword()
          // console.log(name.value)
          // console.log(desc.value)
          // console.log(opt1.checked)
          // console.log(opt2.checked)
          fetch(import.meta.env.VITE_URL + `/users/playlist`, {
            method: 'POST',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({id: pID, name: name.value, description: desc.value === "" ? "null" : desc.value, public: opt1.checked})                                        
          }).then(a => {refetch()})
        }
      })
    }

    const closeIcon = (
      <img src={escape} style={{height: '44px', width: '44px'}}/>
  )
    

    const sortedAlbums = (() => {
      const sortedAlbums = albums.slice()
      switch(sorted){
        case 0:
          return sortedAlbums
        case 1:
          sortedAlbums.sort((a,b) => a.name.localeCompare(b.name))
          return sortedAlbums
        case 2:
          sortedAlbums.sort((a,b) => b.name.localeCompare(a.name))
          return sortedAlbums
        case 3:
          sortedAlbums.sort((a,b) => a.artists[0].name.localeCompare(b.artists[0].name))
          return sortedAlbums
        case 4:
          sortedAlbums.sort((a,b) => b.artists[0].name.localeCompare(a.artists[0].name))
          return sortedAlbums
        default:
          return sortedAlbums
      }      
    })

    const {data: playlists = [], isSuccess: playSuccess, isFetching, refetch} = useGetPlaylistsQuery()
    

    let ready = albumSuccess && podSuccess && audSuccess && playSuccess

    const sortedPlaylists = (() => {
      const sortedPlaylists = playlists.slice()
      switch(psorted){
        case 0:          
          return sortedPlaylists
        case 1:
          sortedPlaylists.sort((a,b) => a.name.localeCompare(b.name))
          return sortedPlaylists
        case 2:
          sortedPlaylists.sort((a,b) => b.name.localeCompare(a.name))
          return sortedPlaylists
        default:
          return sortedPlaylists
      }
    })

    useEffect(() => {    
      
      switch(sessionStorage.getItem('home')){
        case 'album':
          setHtml(Albums(listItems))
          break
        case 'playlist':
          setHtml(Playlists(navigate,listPlaylists))
          break
        case 'podcast':
          setHtml(Podcasts(podcasts))
          break
        case 'audiobook':
          setHtml(Audiobooks(audiobooks))
          break
        // case 'local':
        //   setHtml(localSong())
        //   break
        default:
          setHtml(Albums(listItems))
      }
      setLoading(false)                  
    
  }, [ready,isFetching, sorted,psorted,delsuccess]);
    
  const listItems = sortedAlbums()?.map((a: any, i:any) =>
    <div key={i}>

      <div className="removeContainer" style={{width: '20px'}}>
      <button className="removeAlbum" onClick={function handleClick(){
        setOpensnack(true)        
        setTimeout(() => { deleteAlbum({aID: a.album_id}) },300)
      }}>Remove From Library</button>
      <img src={dots} className="removeImg" style={{marginBottom: '20px', transform: 'rotate(90deg)', height: '20px', width: '20px', margin: '0px', cursor: 'pointer'}} />      
      </div>

    <Card      
      id={a.album_id}
      uri={a.uri}
      image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
      name={a.name}
      artist={a.artists.map((t: any) => t.name)}
      a_id={a.artists.map((t: any) => t.id)}
      key={a.album_id}
    />
    </div>
  )

  

  const listPlaylists = sortedPlaylists()?.map((a: any,i:any) =>
    <div style={{display: 'flex', gap: '20px', alignItems: 'center'}} key={i}>

      <div className="removePContainer" style={{width: '20px'}}>
        <button className="removePlay" onClick={function handleClick(){
          setOpensnack(true)        
          setTimeout(() => { deletePlaylist({pID: a.playlist_id}) },300)
          setTimeout(()=>{refetch() },400)
        }}>Remove From Library</button>
        <img src={dots} className="removeImg" style={{marginBottom: '20px', height: '40px', width: '40px', margin: '0px', cursor: 'pointer'}} />      
      </div>

      <a onClick={function handleClick() {
        
        sessionStorage.setItem("uplist", "true")
        sessionStorage.setItem("playlist_name", a.name)
        navigate(`/app/playlist/${a.playlist_id}`)
      }}>
        
        

        <div style={{display: 'flex', alignItems: 'center', animation: 'fadeIn 0.5s'}}>
        {imageRender(a,300,300,50)}        
        <h2>{a.name}</h2>
        </div>
              
      <br></br>
      
      </a>
      
    </div>
  )
  return (
    <>
      {!ready && !loading ? Spin3() : (
        <>      
      <div className="homeContainer">
          <div className="buttonContainer">            
            <button className="homeButtons" onClick={() => {setHtml(Albums(listItems)),sessionStorage.setItem('home','album')}}>Albums</button>
            <button className="homeButtons" onClick={() => {setHtml(Playlists(navigate, listPlaylists)), sessionStorage.setItem('home','playlist')}}>Playlists</button>
            <button className="homeButtons" onClick={() => {setHtml(Podcasts(podcasts)), sessionStorage.setItem('home', 'podcast') }}>Podcasts</button>
            <button className="homeButtons" onClick={() => {setHtml(Audiobooks(audiobooks)), sessionStorage.setItem('home', 'audiobook')}}>AudioBooks</button>
        
            {/* <button className="homeButtons" onClick={() => {setHtml(localSong()), sessionStorage.setItem('home', 'local') }}>Local</button> */}
            <p style={sessionStorage.getItem('home') === "playlist" ? {display: "inline"} : {display: "none"}} className="addPlaylist" onClick={function handleClick(){
              onOpenModal()                            
            }} >+</p>

            <div className="dropdown" id="dropdown">

            

              <Modal modalId='modal4' open={open} onClose={onCloseModal} center closeIcon={closeIcon}>
              <div style={{color: 'white', marginLeft: '35%',fontWeight: 'bolder',fontSize: '20px'}} >New Playlist</div>
              <form action=""  id="formPlaylist">
                <label htmlFor="first">
                    Name:
                </label>
                <input type="text" id="first" name="first" 
                    placeholder="Enter your Playlist Name" required />
                    
                <label htmlFor="second">
                    Description:
                </label>
                <input type="text" id="second" name="second" 
                    placeholder="Optional"/>
                
                <div style={{color: 'white', fontWeight: 'bolder',fontSize: '20px'}} >Public</div>
                  <div style={{display: 'flex', gap: '10px'}}>
                  <div>
                    <label htmlFor="option1">True</label>
                    <input type="radio" id="option1" name="third" value="True" defaultChecked style={{width: '18px',height: '18px'}} />
                  </div>  

                  <div>
                    <label htmlFor="option2">False</label>
                    <input type="radio" id="option2" name="third" value="False" style={{width: '18px',height: '18px'}} />
                  </div>  
                </div>                   

                <div className="wrap2">
                    <button type="submit" onClick={(() => onCloseModal())}>
                        Submit
                    </button>
                </div>
              </form>

              </Modal>

              <button className="dropbtn">Sort</button>
              <div className="dropdown-content">
                {(sessionStorage.getItem('home') === null || sessionStorage.getItem('home') === 'album') && albumSort(setSorted)}
                {sessionStorage.getItem('home') === 'playlist' && playlistSort(setPSorted)}
              </div>
            </div>
              
          </div>
        
      </div>
          
        {html}      
      
      </>
    )}
    <ButtonScroll />
    {opensnack ? <MySnackbar state={opensnack} setstate={setOpensnack} message="Removed From Library"/> : null}
    </>
  )
}