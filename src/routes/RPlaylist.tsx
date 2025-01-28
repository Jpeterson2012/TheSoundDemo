import './RPlaylist.css'
import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import { Spin, Spin3 } from '../components/Spin/Spin.tsx';
import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import musicBar from '../components/musicBar/musicBar.tsx';
import MySnackbar from '../components/MySnackBar.tsx';
import ButtonScroll from '../components/ButtonScroll/ButtonScroll.tsx';
import { useGetPlaylistsQuery,useDeletePlaylistMutation } from '../App/ApiSlice.ts';

function regPlaylists(ptracks: any, last: any, liked_urls: any, paused: any,setmodal:any,settrack:any){
  let key = 0
  return (
    ptracks?.map((t: any) => 

      <div style={{display: 'flex', alignItems: 'center'}} >

          <p hidden>{liked_urls.push(t.uri)}</p>  
          {!paused ? <span style={{position: 'absolute', left: '9vw'}}>{(sessionStorage.getItem('current') === t.uri || (t.artists?.name === t.name && t.artists?.artists[0].name === t.artist[0].name)) ? musicBar() : null}</span> : null}
          <div className="removeContainer3" style={{display: 'flex', alignItems: 'center'}}>

          <button className="removeAlbum3" onClick={function handleClick(){        
              settrack(t)
              setmodal(true) 
            }}>Edit Playlists</button>
            <img src={dots} className="removeImg2" style={{marginBottom: '20px', height: '30px', width: '30px', margin: '0px', cursor: 'pointer'}} />
            <img src={t.images?.filter((t: any)=>t.height == 64).map((s: any) => s.url)} />

          </div>

          <PTrack 
          uri={"spotify:playlist:" + last}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}
          pause={paused}
          />
        <p hidden>{key++}</p>
      </div>
    )
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

    const {data: playlists = [], refetch} = useGetPlaylistsQuery()
    let found = playlists?.find((e: any) => e?.playlist_id === lastSegment)
    const [deletePlaylist] = useDeletePlaylistMutation()

    var liked_uris: any = []

    useEffect (() => {            
      console.log(found)    
      // console.log(loading)
          
        if (sessionStorage.getItem("ref_id") === lastSegment) {
          setpTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
          setTotal(JSON.parse(sessionStorage.getItem("ref_items")!).length)
          setLoading(false)
        }
        else{
          // const fetchpTracks = async () => {
          //     // setLoading(true)
          //     const resp = await fetch(`https://playground.jmpeterson.dev/auth/ptracks/${lastSegment}`,{
          //       method: 'GET',
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
          //       // console.log(chunk ? JSON.parse(chunk) : {})                
          //       total ? null : setTotal(JSON.parse(chunk).total),
          //       temp = JSON.parse(chunk).items,
          //       a.push(...temp),  
          //       setpTracks([...a])                
          //       }
          //     }
        
          // }
          // fetchpTracks()



          const fetchTracks = async () => {
            try {
                var temp = await fetch(`https://playground.jmpeterson.dev/auth/ptracks/${lastSegment}`)
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
          sessionStorage.setItem("ref_id", lastSegment!)
          sessionStorage.setItem("ref_items", JSON.stringify(tempTracks))
  
        }
        assignTracks()

        }            
        
      }, [sessionStorage.getItem("playlist_name")!]);

    return(
            <>        
                {loading ? Spin3() : (
                    <>
                    <div>
                        
                        {/* Spin Component import now instead of prop */}
                        {Spin(active,paused,sessionStorage.getItem("p_image")!,null)} 
    
                        <div>
            
            
              
                            <div style={{marginBottom: '60px', marginTop: '40px'}}>
                
                                <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>
                                <div style={{display: 'flex', marginRight: '10px'}}>
                                    <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                                    <h5 style={{color: 'rgb(90, 210, 216)'}}>{ptracks?.length} Song(s)</h5>
                                    <p id="addAlbum" style={{height: '35px', width: '35px',fontSize: '20px', marginLeft: '15px', cursor: 'pointer', border: '1px solid #7a19e9', color: 'rgb(90, 210, 216)'}} onClick={function handleClick(){
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
                                          setTimeout (() => {
                                            fetch(`https://playground.jmpeterson.dev/auth/users/playlist`, {
                                              method: 'POST',
                                              headers: {"Content-Type":"application/json"},
                                              body: JSON.stringify({id: lastSegment,name: sessionStorage.getItem("playlist_name"), images: JSON.parse(sessionStorage.getItem("fullp_image")!)})                                        
                                            })
                                          },500)
                                          setTimeout(() => {refetch()},800)                 
                                      }
                                      else{                                        
                                        setSnack(true)        
                                        setTimeout(() => { deletePlaylist({pID: lastSegment!}) },300)                                                                           
                                      }                  
                                    
                                    }}>{found === undefined ? "+" : "✓"}</p>
    
                    
                                </div>
                                <div style={{width: '80vw'}} >
                                  <div style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                                    <span className="lol">Title</span>
                                    <span className="lolP">Duration</span>
                                    </div>
                                  {regPlaylists(ptracks, lastSegment, liked_uris, paused,setModal,setTrackData) }
                                </div>
                                
                
                            </div>
                        </div>
    
                    </div>
                    </>
                )}
                <ButtonScroll />
                {modal ? <EditPlaylist track={trackData} boolVal={modal} setbool={setModal} /> : null}
                {snack ? <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>  : null}
            </>
        )
}


