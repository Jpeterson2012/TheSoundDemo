import './AddLiked.css';
import { useGetLikedQuery, useAddNewLikedMutation } from '../../App/ApiSlice';
import { useState } from 'react';
import 'react-responsive-modal/styles.css';
import MySnackbar from '../MySnackBar';
import EditPlaylist from '../EditPlaylist/EditPlaylist';
import { AddToLibrary } from '../../helpers/AddToLibrary.tsx';

export default function AddLiked({active, trackUri: currentTrack, duration}: any) {
    const {data: liked} = useGetLikedQuery(); 
        
    const [addNewsong] = useAddNewLikedMutation();    
    const [modal,setModal] = useState(false);
    const [snack, setSnack] = useState(false);

    const found = liked?.tracks.find((e:any)=>e.uri === currentTrack?.uri);
    const found2 = liked?.tracks?.find((e:any)=>e.name === currentTrack?.name && e.artists[0].name === currentTrack?.artists[0].name);

    return(
        <>
            <AddToLibrary 
                id='addSong'
                includeStyle={false} 
                onClick={() => {             
                    if (active) {
                        const handleSubmit = async () => {
                            let parts = currentTrack?.album.uri.split(':');
                            let lastSegment = parts.pop() || parts.pop();

                            try{
                                await addNewsong({ album_id: lastSegment, images: currentTrack?.album.images, 
                                    artists: currentTrack?.artists, duration_ms: duration.toString(), uri: `spotify:track:${currentTrack?.id}`, 
                                    name: currentTrack?.name, date_added: new Date().toISOString() }).unwrap()
                            }
                            catch(err){
                                console.error('Failed to save the post: ', err)
                            }
                        }
                        if (found === undefined && found2 === undefined){
                            setSnack(true);

                            handleSubmit();                            
                        } else{
                            setModal(true);
                        }
                    }                                                                           
                }}
            >
                {found === undefined && found2 === undefined ? "+" : "✓"}
            </AddToLibrary>

            {modal && <EditPlaylist track={currentTrack} boolVal={modal} setbool={setModal} setsnack={setSnack} />}
            {snack && <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>}
        </>        
    );
};