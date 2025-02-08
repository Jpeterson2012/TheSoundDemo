import './EditPlaylist.css'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useGetLikedQuery, useGetPlaylistsQuery, useAddNewLikedMutation, useDeleteNewLikedMutation, useAddPTrackMutation, useDeletePTrackMutation } from '../../App/ApiSlice'
import { useState, useEffect } from 'react';
import escape from '../../images/escape.jpg'
import { imageRender } from '../ImageRender/ImageRender';

export default function EditPlaylist({track,boolVal,setbool,setsnack}: any){
    const {data: liked, isSuccess: lsuccess} = useGetLikedQuery()
    const {data: playlists} = useGetPlaylistsQuery()
    
    const [removeSong] = useDeleteNewLikedMutation()
    const [addNewsong] = useAddNewLikedMutation()
    const [addpTrack] = useAddPTrackMutation()
    const [removePTrack] = useDeletePTrackMutation()            
    
    let found = liked?.tracks.find((e:any)=>e.uri === track.uri)
    let found2 = liked?.tracks?.find((e:any)=>e.name === track?.name && e.artists[0].name === track?.artists[0].name)
    
    
    var submit1: boolean[] = []
    var submit2: boolean[] = []
    var parts = track?.album?.uri.split(':');
    let lastSegment: any
    parts !== undefined ? lastSegment = parts.pop() : lastSegment = null

    const [open, setOpen] = useState(boolVal);

    const onOpenModal = () => {setOpen(true),submit1 = [], submit2 = []}
    const onCloseModal = () => {
        //Potential idea for delaying backend requests
        // let num = 500
        setOpen(false);
        let changes = false;
        // console.log(submit1)
        let temp = (document.getElementById('checkbox') as HTMLInputElement).checked

        if (submit1[0] !== temp){            
            changes = true
            submit1[0] === false ?             
            addNewsong({ album_id: lastSegment === null ? track.album_id : lastSegment, images: track?.album?.images?.length === undefined ? track.images : track.album.images, artists: track.artists, duration_ms: track.duration_ms, uri: track.uri, name: track.name })            
            : removeSong({name: track.name})
        }          

        submit2.push(temp)
        for (let i = 0; i < playlists!.length; i++){
            submit2.push((document.getElementById(`checkbox${i}`) as HTMLInputElement).checked)
            // if (submit1[i+1] !== (document.getElementById(`checkbox${i}`) as HTMLInputElement).checked){
                if (submit1[i+1] !== submit2[i+1]){
                changes = true
                submit1[i+1] === false ? 
                setTimeout(() => {
                    let p_id = playlists![i].playlist_id
                    let ptrackData = {images: track?.album?.images?.length === undefined ? track.images : track.album.images, uri: track.uri, name: track.name, track_number: 0, duration_ms: track.duration_ms, artists: track.artists}
                    addpTrack({pID: p_id, initialP: ptrackData})
                },(sessionStorage.getItem("currentContext") === null || sessionStorage.getItem("currentContext") === "null") ? 500 : 250) :
                setTimeout(() => {
                    let p_id = playlists![i].playlist_id
                    removePTrack({pID: p_id, name: track.name})
                },(sessionStorage.getItem("currentContext") === null || sessionStorage.getItem("currentContext") === "null") ? 500 : 250)
                
                // num += 500
            }
        }
        // console.log(submit2)
        setbool(false)
        changes ? setsnack(changes) : null
        
    }
    const closeIcon = (
        <img src={escape} style={{height: '44px', width: '44px'}}/>
    )
    useEffect(() => {                 
    },[boolVal])

    
    return (
        <>
        `  <div>                        
                <Modal modalId='modalComp' open={open} onClose={onCloseModal} center closeIcon={closeIcon}>                            
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img className='modalCompImg' src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '80px', width: '80px', marginRight: '20px'}}/>
                        <h3 style={{fontSize: '18px',color: 'white'}} >Liked Songs</h3>
                         {/* <button>{found === undefined ? "Add" : "Remove"}</button> */}
                        <input id='checkbox' type='checkbox' />
                        <p hidden>
                        {open ? (()=>{
                            setTimeout(()=>{
                                found === undefined && found2 === undefined ? null : (document.getElementById('checkbox') as HTMLInputElement ).checked = true
                                submit1.push((document.getElementById('checkbox') as HTMLInputElement).checked)
                            },300)
                            return ''
                        }                                    
                        )() : null}
                        </p>
                        </div>
                    {playlists!.map((a: any,i: any) =>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                        {imageRender(a,80,80,20)}
                        <h3 style={{maxWidth: '500px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '18px',color: 'white'}} >{a.name}</h3>
                        <input id={"checkbox" + i} type='checkbox'/>
                        <p hidden>
                        {open ? (()=>{
                            setTimeout(()=>{
                                // some track uris are from their single version which is diff from the album version so this checks track uri && (name and artist) together
                                (a.tracks?.find((e: any)=>e.uri === track?.uri) === undefined && (a.tracks?.find((e:any)=>e.name === track?.name && e.artists[0].name === track?.artists[0].name) === undefined)) ? null : (document.getElementById(`checkbox${i}`) as HTMLInputElement ).checked = true
                                submit1.push((document.getElementById(`checkbox${i}`) as HTMLInputElement).checked)
                            },300)
                            return ''
                        }
                        )() : null}
                        </p>
                
                        </div>    
                    )}                                                          
                </Modal>
            </div>`
        </>
    )

}