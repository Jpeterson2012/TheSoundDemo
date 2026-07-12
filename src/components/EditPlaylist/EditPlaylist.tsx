import './EditPlaylist.css'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useGetLikedQuery, useGetPlaylistsQuery, useAddNewLikedMutation, useDeleteNewLikedMutation, useBulkEditPTracksMutation } from '../../App/ApiSlice';
import { useState, useEffect } from 'react';
import { imageRender } from '../ImageRender/ImageRender';
import { useAppDispatch } from '../../App/hooks.ts';
import { setExitingSong } from '../../App/defaultSlice.ts';
import { closeIcon } from '../../helpers/CloseIcon.tsx';

export default function EditPlaylist({track,boolVal,setbool,setsnack}: any) {    
    const {data: liked, isSuccess: lsuccess} = useGetLikedQuery();
    const {data: playlists} = useGetPlaylistsQuery()

    let newPlaylists: any = {};

    playlists!.map((item: any) => {            
        newPlaylists[item.playlist_id] = {checked: item.tracks?.find((e: any)=>e.uri === track?.uri && e.name === track?.name && e.artists[0].name === track?.artists[0].name) !== undefined, ...item}
    });

    newPlaylists = Object.values(newPlaylists)!.sort((a:any,b:any) => Number(b.checked) - Number(a.checked));
    
    const [removeSong] = useDeleteNewLikedMutation();
    const [addNewsong] = useAddNewLikedMutation();   
    const [bulkEdit] = useBulkEditPTracksMutation();         
    
    let found = liked?.tracks.find((e:any) => e.uri === track.uri || (e.name === track?.name && e.artists[0].name === track?.artists[0].name));    
    
    let parts = track?.uri?.split(':') ?? track?.album?.uri?.split(':');
    let lastSegment: any;
    parts ? lastSegment = null : lastSegment = parts.pop();

    const [open, setOpen] = useState(boolVal);
    const [originalChecked, setOriginalChecked] = useState(new Set());
    const [currentChecked, setCurrentChecked] = useState(new Set());

    const dispatch = useAppDispatch();

    const onOpenModal = () => {setOpen(true)};

    const onCloseModal = () => {               
        //Potential idea for delaying backend requests        
        setOpen(false);
        let changes = false;
        // console.log(submit1)
        let temp = (document.getElementById('checkbox') as HTMLInputElement).checked;

        if ((found !== undefined) !== temp) {            
            changes = true;

            if (found) {
                dispatch(setExitingSong(track.uri));

                setTimeout(() => {
                    removeSong({name: track.name});

                    dispatch(setExitingSong(null));
                }, 250);                
            } else {
                addNewsong({ 
                    album_id: lastSegment ?? track.album_id, 
                    images: track?.album?.images?.length === undefined ? track.images : track.album.images, 
                    artists: track.artists, 
                    duration_ms: track.duration_ms, 
                    uri: track.uri, 
                    name: track.name,
                    date_added: new Date().toISOString(), 
                });
            }
        }                  

        const pUpdates: any = {trackUri: track.uri, updates: []};

        const { added, removed } = getChangedPlaylists();    
        
        added.map(remove => {
            const ptrackData = {images: track?.album?.images?.length === undefined ? track.images : track.album.images, 
                uri: track.uri, name: track.name, track_number: 0, duration_ms: track.duration_ms, artists: track.artists, date_added: new Date().toISOString()};

            pUpdates.updates.push({pID: remove, initialP: ptrackData, status: "add"});
        });

        removed.map(add => pUpdates.updates.push({pID: add, status: "remove"}));        

        dispatch(setExitingSong(track.uri));

        pUpdates.updates.length && bulkEdit({pUpdates});
        setbool(false);
        changes && setsnack(changes);     

        dispatch(setExitingSong(null));
    };

    useEffect(() => {                                   
        const initialSet = new Set(
            newPlaylists.filter((p: any) => p.checked).map((p: any) => p.playlist_id)
        );

        setOriginalChecked(initialSet);

        setCurrentChecked(new Set(initialSet));
    },[]);

    function togglePlaylist(id: any) {
        setCurrentChecked(prev => {
            const next = new Set(prev);

            next.has(id) ? next.delete(id) : next.add(id);

            return next;
        });
    };

    function getChangedPlaylists() {
        const added = [...currentChecked].filter(id => !originalChecked.has(id));
        const removed = [...originalChecked].filter(id => !currentChecked.has(id));

        return {added, removed};
    };
    
    return (
        <>                 
            <Modal modalId='modalComp' open={open} onClose={onCloseModal} center closeIcon={closeIcon()}>                            
                <div style={{display: 'flex', alignItems: 'center',marginTop: '60px'}}>
                    <img 
                        className='modalCompImg' 
                        src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" 
                        alt="Liked Songs"  
                        style={{height: '80px', width: '80px', marginRight: '20px',borderRadius: '10px'}}
                    />

                    <h3 style={{fontSize: '18px',color: 'white', marginRight: 'auto'}}>Liked Songs</h3>
                        
                    <input 
                        id='checkbox' 
                        type='checkbox'
                        defaultChecked={found !== undefined}
                        
                    />
                </div>

                {newPlaylists.map((a: any,i: any) =>
                    <div style={{display: 'flex', alignItems: 'center'}} key={i}>

                        {imageRender(a,80,80,20)}

                        <h3 style={{maxWidth: '500px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '18px',color: 'white', marginRight: 'auto'}} >{a.name}</h3>

                        <input 
                            id={"checkbox" + i} 
                            type='checkbox'
                            checked={currentChecked.has(a.playlist_id)}
                            onChange={() => togglePlaylist(a.playlist_id)}

                        />
                    </div>    
                )}                                                          
            </Modal>
        </>
    );
};