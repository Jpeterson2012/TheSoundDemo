import './RPlaylist.css'
import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import { Spin, Spin3 } from '../components/Spin/Spin.tsx';
import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import MySnackbar from '../components/MySnackBar.tsx';
import ButtonScroll from '../components/ButtonScroll/ButtonScroll.tsx';
import { useGetPlaylistsQuery,useDeletePlaylistMutation } from '../App/ApiSlice.ts';
import { filterTracks } from "../components/filterTracks.tsx";

function regPlaylists(ptracks: any, last: any, liked_urls: any, paused: any,setmodal:any,settrack:any,rplay:any,filter_val:any){
  let temp2 = document.getElementById('dropdown-content2')!
  temp2 !== null ? temp2.style.display = 'none' : null;
  let key = 0
  return (
    ptracks?.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).map((t: any) => 

      <div style={{display: 'flex', alignItems: 'center'}} key={t.uri.split(':').pop()}>

          <p hidden>{liked_urls.push(t.uri)}</p>            
          <div className="removeContainer3" id='removeContainer3'>

          <button className="removeAlbum3" onClick={function handleClick(){        
              settrack(t)
              setmodal(true) 
            }}>Edit Playlists</button>
            <img src={dots} onClick={function handleClick(){
              settrack(t)
              setmodal(true)
            }} className="removeImg2"/>
            <img className="uPlaylistImgs" src={t.images?.filter((t: any)=>t.height == 64).map((s: any) => s.url)} />

          </div>

          <PTrack 
          uri={"spotify:playlist:" + last}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}
          rplay={rplay}
          paused={paused}          
          />
        <p hidden>{key++}</p>
      </div>
    )
  )
}

function playlistSort(tplaylist: any, setTPlaylist: any){
  let temp: any
  return(
    <>
    <button className="theme" onClick={function handleClick(){      
      temp = tplaylist                        
      temp.sort((a:any,b:any) => a.name.localeCompare(b.name))      
      setTPlaylist([...temp])
    }}>A-Z</button>

    <button className="theme" onClick={function handleClick(){ 
      temp = tplaylist     
      temp.sort((a:any,b:any) => b.name.localeCompare(a.name))
      setTPlaylist([...temp])
    }}>Z-A</button>

    <button className="theme" onClick={function handleClick(){  
      temp = tplaylist  
      temp.sort((a:any,b:any) => a.artists[0].name.localeCompare(b.artists[0].name))
      setTPlaylist([...temp])
    }}>Artist A-Z</button>

    <button className="theme" onClick={function handleClick(){   
      temp = tplaylist   
      temp.sort((a:any,b:any) => b.artists[0].name.localeCompare(a.artists[0].name))
      setTPlaylist([...temp])
    }}>Artist Z-A</button>
    </>
  )
}

export default function RPlaylist({lastSegment, active, paused}: any){
    const [ptracks, setpTracks] = useState<any>([]);
    const [total, setTotal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [modal, setModal] = useState(false)
    const[trackData, setTrackData] = useState(null)
    const[snack, setSnack] = useState(false)
    const [rplay, setRplay] = useState(true)
    const [filter_val, setFilter_val] = useState<string>('')

    const {data: playlists = [], refetch} = useGetPlaylistsQuery()
    let found = playlists?.find((e: any) => e?.playlist_id === lastSegment)
    const [deletePlaylist] = useDeletePlaylistMutation()

    var liked_uris: any = []

    useEffect (() => {                 
          
        // if (sessionStorage.getItem("ref_id") === lastSegment) {
        //   setpTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
        //   setTotal(JSON.parse(sessionStorage.getItem("ref_items")!).length)
        //   setLoading(false)
        // }
        if (sessionStorage.getItem("cplaylist") !== undefined && sessionStorage.getItem("cplaylist") !== null) {
          console.log(JSON.parse(sessionStorage.getItem("cplaylist")!))
          setpTracks(JSON.parse(sessionStorage.getItem("cplaylist")!))
          setLoading(false)
        }
        else{
          // const fetchpTracks = async () => {
          //     // setLoading(true)
          //     const resp = await fetch(import.meta.env.VITE_URL + `/ptracks/${lastSegment}`,{
          //       method: 'GET',
          //       credentials: "include",
          //       headers: {"Content-Type":"application/json"},
          //     })
          //     setLoading(false)
          //     let reader = resp.body!.getReader()
          //     let result
          //     let temp
          //     let a = []
          //     let decoder = new TextDecoder('utf8')
          //     while(!result?.done){
          //       result = await reader.read()
          //       if (!result?.done){
                  
          //       let chunk = decoder.decode(result.value)
          //       console.log(chunk ? JSON.parse(chunk) : {})                
          //       total ? null : setTotal(JSON.parse(chunk).total),
          //       temp = JSON.parse(chunk).items,
          //       a.push(...temp),  
          //       setpTracks([...a])                
          //       }
          //     }
          //     // console.log(ptracks)
        
          // }
          // fetchpTracks()



          const fetchTracks = async () => {
            try {
                var temp = await fetch(import.meta.env.VITE_URL + `/ptracks/${lastSegment}`,{credentials: "include"})
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
          setLoading(false)
          console.log(tempTracks)
          setpTracks(tempTracks.items)
          // sessionStorage.setItem("ref_id", lastSegment!)
          // sessionStorage.setItem("ref_items", JSON.stringify(tempTracks))
  
        }
        assignTracks()

        }       
            
        
      }, [sessionStorage.getItem("playlist_name")!]);

    return(
            <>        
                {loading ? Spin3() : (
                    <>
                    <div style={{marginBottom: '150px'}}>
                        
                        {/* Spin Component import now instead of prop */}
                        {Spin(active,paused,sessionStorage.getItem("p_image")!,null)} 
    
                        <div>
            
            
              
                            <div style={{marginBottom: '60px', marginTop: '40px'}}>
                
                                <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>
                                <div className="desc2" style={{display: 'flex', marginRight: '10px', alignItems: 'center'}}>
                                    <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                                    <h5 style={{color: 'rgb(90, 210, 216)'}}>{ptracks?.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).length} Song(s)</h5>
                                    {(sessionStorage.getItem("cplaylist") !== undefined && sessionStorage.getItem("cplaylist") !== null) ? null : <p id="addAlbum" style={{height: '35px', width: '35px',fontSize: '20px', marginLeft: '15px', cursor: 'pointer', border: '1px solid #7a19e9', color: 'rgb(90, 210, 216)'}} onClick={function handleClick(){
                                      setSnack(true)
                                      let temp2 = document.getElementById('addAlbum')!
                                      temp2.style.transform = 'scale(1)'
                                      temp2.style.animation = 'pulse3 linear 1s'
                                      setTimeout(()=>{
                                          temp2.style.removeProperty('animation')
                                          temp2.style.removeProperty('transform')
                                      }, 1000)                    
                                    
                                      if (found === undefined ){           
                                        setSnack(true)
                                        setRplay(false)         
                                          setTimeout (() => {
                                            fetch(import.meta.env.VITE_URL + `/users/playlist`, {
                                              method: 'POST',
                                              headers: {"Content-Type":"application/json"},
                                              credentials: "include",
                                              body: JSON.stringify({id: lastSegment,name: sessionStorage.getItem("playlist_name"), images: JSON.parse(sessionStorage.getItem("fullp_image")!)})                                        
                                            })
                                          },500)
                                          setTimeout(() => {refetch()},800)                 
                                      }
                                      else{                                        
                                        setSnack(true)                                                
                                        setTimeout(() => { deletePlaylist({pID: lastSegment!}), setRplay(true) },300)                                                                           
                                      }                  
                                    
                                    }}>{found === undefined ? "+" : "✓"}</p>}

                                    <div className="dropdown" id="dropdown">
                                                                      
                                    <button className="dropbtn" style={{marginLeft: '100%'}} onClick={function handleClick(){
                                      let temp = document.getElementById('dropdown-content2')!
                                      if (temp.style.display === 'flex') temp.style.display = 'none'
                                      else {
                                        temp.style.display = 'flex'
                                        temp.style.flexDirection = 'column'
                                      }
                                      }} >Sort</button>
                                      <div className="dropdown-content2" id='dropdown-content2'>
                                            {playlistSort(ptracks, setpTracks)}
                                      </div>
                                    </div>                                    
                                    
    
                    
                                </div>

                                {filterTracks(setFilter_val)}


                                <div className="tdContainer" style={{width: '80vw'}} >
                                  <div className="subTdContainer" style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                                    <span className="lol">Title</span>
                                    <span className="lolP">Duration</span>
                                    </div>
                                  {regPlaylists(ptracks, lastSegment, liked_uris, paused,setModal,setTrackData,rplay,filter_val) }
                                </div>
                                
                
                            </div>
                        </div>
    
                    </div>
                    </>
                )}
                <ButtonScroll />
                {modal ? <EditPlaylist track={trackData} boolVal={modal} setbool={setModal} setsnack={setSnack} /> : null}
                {snack ? <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>  : null}
            </>
        )
}


