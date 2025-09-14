import './AddLiked.css'
import { useGetLikedQuery, useAddNewLikedMutation } from '../../App/ApiSlice'
import { useState } from 'react';
import 'react-responsive-modal/styles.css';
import MySnackbar from '../MySnackBar';
import EditPlaylist from '../EditPlaylist/EditPlaylist';

export default function AddLiked({active,trackUri: currentTrack,duration}: any){
    const {data: liked} = useGetLikedQuery()    
        
    const [addNewsong] = useAddNewLikedMutation()    
    const[modal,setModal] = useState(false)
    const[snack, setSnack] = useState(false)

    let found = liked?.tracks.find((e:any)=>e.uri === currentTrack?.uri)
    let found2 = liked?.tracks?.find((e:any)=>e.name === currentTrack?.name && e.artists[0].name === currentTrack?.artists[0].name)

    return(
        <>
            {!active ? null : (
                <>                                    
                    <p id='addSong' onClick={function handleClick(){
                                    
                        const handleSubmit = async () => {
                            var parts = currentTrack?.album.uri.split(':');
                            var lastSegment = parts.pop() || parts.pop();

                            try{
                                await addNewsong({ album_id: lastSegment, images: currentTrack?.album.images, artists: currentTrack?.artists, duration_ms: duration.toString(), uri: `spotify:track:${currentTrack?.id}`, name: currentTrack?.name }).unwrap()
                            }
                            catch(err){
                                console.error('Failed to save the post: ', err)
                            }
                        }
                        if (found === undefined && found2 === undefined){
                            setSnack(true)
                            handleSubmit()
                            let temp = document.getElementById('addSong')!
                            temp.style.animation = 'pulse3 linear 1s'
                            setTimeout(()=>{
                                temp.style.removeProperty('animation')
                            }, 1000)                            
                        }
                        else{
                            setModal(true)
                        }
                        
                    }}>{found === undefined && found2 === undefined ? "+" : "✓"}</p>
                </>
            )}
            {modal ? <EditPlaylist track={currentTrack} boolVal={modal} setbool={setModal} setsnack={setSnack} /> : null}
            {snack ? <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>  : null}
        </>        
    )
}