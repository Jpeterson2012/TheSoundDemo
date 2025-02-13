//Session storage vars ref_id and ref_items created here
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './RAlbum.css'
import Track from "../components/Track/Track.tsx";
import { useGetAlbumsQuery, useAddAlbumMutation,useDeleteAlbumMutation } from "../App/ApiSlice.ts";

import { Spin,Spin3 } from "../components/Spin/Spin.tsx";
import musicBar from "../components/musicBar/musicBar.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";

import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import { filterTracks } from "../components/filterTracks.tsx";

export default function RAlbum({active, paused}: any) {
    const navigate = useNavigate()
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    const [tracks, setTracks] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true)
    var zip = JSON.parse(sessionStorage.getItem("artist")!).map(function(e: any,i: number){
      return [e, JSON.parse(sessionStorage.getItem("artist_id")!)[i]]
    })

    const [addAlbum] = useAddAlbumMutation()
    const [deleteAlbum] = useDeleteAlbumMutation()
    const {data: albums = []} = useGetAlbumsQuery()
    const[snack, setSnack] = useState(false)
    const [modal, setModal] = useState(false)
    const[trackData, setTrackData] = useState<any>(null)
    const [filter_val, setFilter_val] = useState<string>('')
    //Check if album is already in library or not
    let found = albums?.find((e: any) => e?.album_id === lastSegment)
    

    useEffect (() => {
        sessionStorage.setItem("albumStatus", "notuser")
      if (sessionStorage.getItem("ref_id") === lastSegment) {
        setTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
        setIsLoading(false)
      }
      else{
      const fetchTracks = async () => {
          try {
              var temp = await fetch(import.meta.env.VITE_URL + `/tracks/${lastSegment}`)
            .then((res) => {
              // console.log(res.json())
              return res.json();
            }).then((data) => {return data})
              return temp
            }
            catch (err) {}
      }
      const assignTracks = async () => {
        // setIsLoading(true)
        const tempTracks = await fetchTracks()
        setIsLoading(false)
        // console.log(tempTracks)
        setTracks(tempTracks)
        sessionStorage.setItem("ref_id", lastSegment!)
        sessionStorage.setItem("ref_items", JSON.stringify(tempTracks))

      }
      assignTracks()
    }
      //This fixes render bug where fetch doesn't activate when clicking on currently playing album
    }, [sessionStorage.getItem("image")]);
    
    const listItems = tracks.albums?.tracks?.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).map((t: any, i:any) =>
      <div className="listContainer" key={i}>

      <div className="removeContainer3" style={{display: 'flex', alignItems: 'center'}}>
      
      <button className="removeAlbum3" onClick={function handleClick(){               
          let temp = {images: tracks?.albums?.images, uri: t.uri, name: t.name, track_number: 0, duration_ms: t.duration_ms, artists: t.artists}                                   
          setTrackData(temp)
          setModal(true)               
        }}>Edit Playlists</button>
        <img src={dots} className="removeImg2" style={{paddingTop: '10px',height: '27px', width: '27px', cursor: 'pointer'}} />            
      
      </div>

        {!paused ? <span className="musicBars" style={{position: 'absolute', left: '8vw', marginTop: '5px'}}>{(sessionStorage.getItem('current') === t.uri || (t.artists?.name === t.name && t.artists?.artists[0].name === t.artist[0].name)) ? musicBar() : null}</span> : null}
        <Track 
        uri={tracks.albums.uri}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={null}
        artist={t.artists}
        t_uri={t.uri}
        pause={paused}
      />
      </div>       
    )
    
    return (
      <>

        {isLoading ? Spin3() : (
          <>

            <div className="topDiv">
              <h2 style={{fontSize: '30px'}} >{tracks?.albums?.name}</h2>
              
              {/* Spin Component import now instead of prop */}
              {Spin(active,paused,sessionStorage.getItem("image")!,null)}


              <h2 className="artistName">{zip.map((s: any,i: number,row: any) =>
                <a key={i}  onClick={function handleClick() {
                  navigate(`/app/artist/${s[1]}`)
                }}>{row.length - 1 !== i ? s[0] + ", " : s[0]}</a>             
              )}</h2>

              <div className="albumDescription">
                <div className="innerDescription">
                  <h5 className="desc1">{tracks.albums?.album_type === 'single' && tracks.albums?.total_tracks > 1 ? 'EP' : tracks.albums?.album_type } &#8226;</h5>
                  <h5>{tracks.albums?.tracks.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).length + " Song(s)" }</h5>              
                </div>

                {/* <img src={tracks.images?.map(b => b.find(b => b.height > 100).url)} style={{borderRadius: '50%', height: '40px'}} /> */}
                {tracks.images?.map((a: any, i:any) => <img key={i} className="tinyArtist" src={a.find((b: any) => b.height > 160).url} />)}                
                <p id="addAlbum" style={{height: '35px', width: '35px',fontSize: '20px', marginLeft: '15px', cursor: 'pointer', border: '1px solid #7a19e9', color: 'rgb(90, 210, 216)'}} onClick={function handleClick(this:any){
                  setSnack(true)                  
                  let temp = document.getElementById('addAlbum')!
                  temp.style.transform = 'scale(1)'
                  temp.style.animation = 'pulse3 linear 1s'
                  setTimeout(()=>{
                      temp.style.removeProperty('animation')
                      temp.style.removeProperty('transform')
                  }, 1000)                    

                  if (found === undefined){                                        
                    setTimeout(() => { addAlbum({album_type: tracks?.albums?.album_type, total_tracks: tracks?.albums?.total_tracks, album_id: lastSegment!, images: tracks?.albums?.images, name: tracks?.albums?.name, release_date: tracks?.albums?.release_date, uri: tracks?.albums?.uri, artists: tracks?.albums?.artists, tracks: tracks?.albums?.tracks, copyrights: tracks?.albums?.copyrights, label_name: tracks?.albums?.label}) },1100)                 
                  }
                  else{                    
                      setTimeout(() => { deleteAlbum({aID: lastSegment!}) },1100)                                 
                  }                  

                }}>{found === undefined ? "+" : "✓"}</p>

                
              </div>

              {filterTracks(setFilter_val)}




              
            </div>

            <div className="tdContainer" style={{width: '80vw'}}>
            <div style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
              <span className="rTitle">Title</span>
              <span className="rTitle2">Duration</span>
              </div>
            {listItems}
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '50px', marginBottom: '50px'}}>
              {tracks.images?.map((a: any, i:any) => <img key={i} src={a.find((b: any) => b.height > 160).url} style={{width: '90px', height: '90px'}} />)}
            </div>
            
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>Release Date: {tracks.albums?.release_date}</h5>
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>{ tracks.albums?.copyrights[0]?.text} </h5>
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>(R) {tracks.albums?.label}</h5>
            <p style={{marginBottom: '100px'}}></p>

          </>

        )}
        <ButtonScroll />
        {modal ? <EditPlaylist track={trackData} boolVal={modal} setbool={setModal} setsnack={setSnack} /> : null}
        {snack ? <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>  : null}
      </>
    )
}