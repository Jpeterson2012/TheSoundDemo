//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import { useGetPlaylistsQuery, useGetLikedQuery, Playlists, useDeleteNewLikedMutation, useDeletePTrackMutation, useDeletePlaylistMutation } from "../App/ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'
import './UPlaylist.css'
import { Spin } from "../components/Spin/Spin.tsx";
import dots from "../images/dots.png"
import EditPlaylist from "../components/EditPlaylist/EditPlaylist.tsx";
import musicBar from "../components/musicBar/musicBar.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";

function customImage(ptracks: any){
  return(
    <div className="mainImage2">
      <div className="subImage" >
        <img className="subsubImage" style={{borderRadius: '15px 0px 0px 0px'}} src={ptracks.tracks[0]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
        <img className="subsubImage" style={{borderRadius: '0px 15px 0px 0px'}} src={ptracks.tracks[1]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
      </div>
      <div className="subImage" >
        <img className="subsubImage" style={{borderRadius: '0px 0px 0px 15px'}} src={ptracks.tracks[2]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
        <img className="subsubImage" style={{borderRadius: '0px 0px 15px 0px'}} src={ptracks.tracks[3]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
      </div>
    </div>
  )
}

function returnUrl(ptracks: any){  
  
  if (ptracks.images.length === 0) return 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg'
  else if (ptracks.images.length === 1) return ptracks.images.map((s:any) => s.url)
  else return ptracks.images.filter((t: any) => t.height == 640).map((s: any) => s.url)
  
}
{/* Old method of playling playlist using playlist uri. doesnt work with sorting */}
{/* {last == 'likedsongs' ? liked_urls.push(t.uri) : liked_urls = null } */}
function userPlaylists(userLists: any, liked_urls: any, paused: any,removeSong: any, removePTrack: any, lastSegment: any,setmodal:any,settrack: any,setsnack:any) {
  let key = 0  
  return (
    userLists?.tracks?.map((t: any) =>

      <div key={t.uri.split(':').pop()} style={{display: 'flex', alignItems: 'center'}}>

          <p hidden>{liked_urls.push(t.uri)}</p>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            {/* Music bar animation here */}
            {!paused ? <span style={{position: 'absolute', left: '9vw'}}>{(sessionStorage.getItem('current') === t.uri || (t.artists?.name === t.name && t.artists?.artists[0].name === t.artist[0].name)) ? musicBar() : null}</span> : null}
            <div className="removeContainer2" style={{width: '20px'}}>
              <div className="removeAlbum2">

              <button style={{color: 'black',background: 'rgb(90, 210, 216)', fontSize: '13px',width: '130px', height: '60px'}} onClick={function handleClick(){  
                 settrack(t)
                setmodal(true)                                     
              }}>Edit Playlists</button>

              {lastSegment !== 'likedsongs' ? null : <button style={{color: 'black',background: 'rgb(90, 210, 216)', fontSize: '13px', width: '130px', height: '60px'}} onClick={function handleClick(){  
                  setsnack(true)
                
                  lastSegment === 'likedsongs' ? setTimeout(() => { removeSong({name: t.name}) },300) : setTimeout(() => { removePTrack({pID: userLists.playlist_id, name: t.name}) },500)
              }}>Remove From Liked Songs</button>}

              </div>
              <img src={dots} className="removeImg2" style={{marginBottom: '20px', height: '30px', width: '30px', margin: '0px', cursor: 'pointer'}} />      
            </div>
            <img className="uPlaylistImgs" src={t.images.filter((t: any)=>t.height == 64).map((s: any) => s.url)} style={{height: '64px', width: '64px'}}/>
          </div>
          
          <PTrack 
          uri={userLists.uri}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}          
          />
        <p hidden>{key++}</p>
        {/* <h1 id="deleteSong" onClick={function handleClick(){          
                
          lastSegment === 'likedsongs' ? setTimeout(() => { removeSong({name: t.name}) },500) : setTimeout(() => { removePTrack({pID: userLists.playlist_id, name: t.name}) },500)

        
        }}>-</h1> */}
      </div>
    )
  )
}

export default function UPlaylist({lastSegment, active, paused}: any){
    const [loading, setLoading] = useState(true)
    var liked_uris: any = []

    const {data: liked, isSuccess: lsuccess} = useGetLikedQuery()
    const [removeSong] = useDeleteNewLikedMutation()
    const [removePTrack] = useDeletePTrackMutation()
    const [modal, setModal] = useState(false)
    const[trackData, setTrackData] = useState(null)
    const[snack, setSnack] = useState(false)
    const [deletePlaylist] = useDeletePlaylistMutation()
    const [tplaylist, setTplaylist] = useState<any>([])

    const {data: pStorm = []} = useGetPlaylistsQuery()
  
    type getPlaylistfromResultArg = TypedUseQueryStateResult<Playlists[],any,any>
    
    const selectOnePlaylist = createSelector(
        (res: getPlaylistfromResultArg) => res.data,
        (res: getPlaylistfromResultArg, userId: string) => userId,
        (data, userId) => data?.filter(plist => plist.playlist_id === userId)
    )

    const { singlePlist, isSuccess: psuccess } = useGetPlaylistsQuery(undefined, {
      selectFromResult: result => ({
        ...result,
        singlePlist: selectOnePlaylist(result, lastSegment!)
      })
    })

    let truth: boolean = lsuccess && psuccess

    useEffect(()=>{                
        if(truth) setLoading(false)     
          if (psuccess){
          singlePlist!.length > 0 ? (sessionStorage.setItem("u_playlist",JSON.stringify(singlePlist!)), setTplaylist(singlePlist!)) : setTplaylist(JSON.parse(sessionStorage.getItem("u_playlist")!))
          }
    },[lsuccess,liked,pStorm])

    

    return(
        <>        
            {loading ? null : (
                <>
                <div style={{marginBottom: '100px'}} >                    

                    {(lastSegment! === 'likedsongs' ? Spin(active,paused,"https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg",null) 
                    : (tplaylist[0]?.images.length === 0 && tplaylist[0]?.tracks.length > 3) ? Spin(active,paused,"",customImage(tplaylist[0])) 
                    : Spin(active,paused,returnUrl(tplaylist![0]),null) )}

                    <div>
                    
                        <div style={{marginBottom: '60px', marginTop: '40px'}}>
            
                            <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>
                            <div className="desc2" style={{display: 'flex', marginRight: '10px'}}>
                                <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                                <h5  style={{color: 'rgb(90, 210, 216)'}}>{lastSegment == 'likedsongs' ? liked?.tracks?.length : tplaylist![0].tracks.length} Song(s)</h5>

                               {lastSegment === 'likedsongs' ? null : <p id="addAlbum" style={{height: '35px', width: '35px',fontSize: '20px', marginLeft: '15px', cursor: 'pointer', border: '1px solid #7a19e9', color: 'rgb(90, 210, 216)'}} onClick={function handleClick(){
                                      setSnack(true)
                                      let temp2 = document.getElementById('addAlbum')!
                                      temp2.style.transform = 'scale(1)'
                                      temp2.style.animation = 'pulse3 linear 1s'
                                      setTimeout(()=>{
                                          temp2.style.removeProperty('animation')
                                          temp2.style.removeProperty('transform')
                                      }, 1000)                    
                                    
                                      if (singlePlist!.length === 0 ){           
                                        setSnack(true)         
                                          setTimeout (() => {
                                            fetch(import.meta.env.VITE_URL + `/users/playlist`, {
                                              method: 'POST',
                                              headers: {"Content-Type":"application/json"},
                                              body: JSON.stringify({id: lastSegment,name: sessionStorage.getItem("playlist_name"), images: JSON.parse(sessionStorage.getItem("fullp_image")!)})                                        
                                            })
                                          },500)                                                           
                                      }
                                      else{                                        
                                        setSnack(true)        
                                        setTimeout(() => { deletePlaylist({pID: lastSegment!}) },300)                                                                           
                                      }                  
                                    
                                    }}>{singlePlist!.length === 0 ? "+" : "✓"}</p>}

                
                            </div>                            

                            <div className="tdContainer" style={{width: '80vw'}} >
                            <div className="subTdContainer" style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                              <span className="lolP2">Title</span>
                              <span className="lolP">Duration</span>
                              </div>
                            {userPlaylists(lastSegment == 'likedsongs' ? liked : tplaylist![0], liked_uris, paused,removeSong, removePTrack, lastSegment,setModal,setTrackData,setSnack) }
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
