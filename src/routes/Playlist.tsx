import './Playlist.css';
import { useState, useEffect, useContext, useMemo } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import PTrack from "../components/PTrack/PTrack.tsx";
import { useGetPlaylistsQuery, useGetLikedQuery, useDeleteNewLikedMutation, useDeletePlaylistMutation } from "../App/ApiSlice.ts";
import { Spin, Spin3 } from "../components/Spin/Spin.tsx";
import dots from "../images/dots.png";
import EditPlaylist from "../components/EditPlaylist/EditPlaylist.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import { filterTracks } from "../components/filterTracks.tsx";
import { spotifyRequest, spotifyStreamRequest, msToReadable, stockImage } from '../utils/utils.ts';
import { AddToLibrary } from '../helpers/AddToLibrary.tsx';
import { useAppSelector } from '../App/hooks.ts';
import CustomDropdown from '../helpers/CustomDropdown/CustomDropdown.tsx';

const customImage = (ptracks: any) => {
  const imageData: Record<number, string> = {
    0: '15px 0px 0px 0px',
    1: '0px 15px 0px 0px',
    2: '0px 0px 0px 15px',
    3: '0px 0px 15px 0px',
  };

  const subSubImage = (index: number) => {
    return (
      <img 
        className="subsubImage" 
        style={{borderRadius: imageData[index]}} 
        src={ptracks.tracks[index]?.images.find((image: any) => image.height == 300)?.url}
      />
    );
  };

  return (
    <div className="mainImage2">
      <div className="subImage" >
        {subSubImage(0)}

        {subSubImage(1)}
      </div>

      <div className="subImage" >
        {subSubImage(2)}

        {subSubImage(3)}
      </div>
    </div>
  );
};

const returnUrl = (ptracks: any) => {      
  if (!ptracks?.images?.length) return sessionStorage.getItem("p_image")! ?? stockImage;
  else if (ptracks?.images?.length === 1) return ptracks.images[0]?.url;
  else return ptracks?.images?.find((image: any) => image.height == 640)?.url; 
};

const playlistSort = (tplaylist: any, setTPlaylist: any) => {  
  let tracksData: any;

  const buttonData: any = {
    "A-Z": (a:any,b:any) => a.name.localeCompare(b.name),
    "Z-A": (a:any,b:any) => b.name.localeCompare(a.name),
    "Artist A-Z": (a:any,b:any) => a.artists[0].name.localeCompare(b.artists[0].name),
    "Artist Z-A": (a:any,b:any) => b.artists[0].name.localeCompare(a.artists[0].name),
    "Oldest": (a:any,b:any) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime(),
    "Newest": (a:any,b:any) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime(),
  };

  return Object.keys(buttonData).map((key, index) =>
    <button 
      key={index}
      className="theme" 
      onClick={() => {                  
        tracksData = tplaylist.tracks.slice();

        tracksData.sort(buttonData[key]);      ;

        setTPlaylist({...tplaylist, tracks: tracksData});      
      }}
    >
      {key}
    </button>
  );
};

export default function Playlist () {
  const {id: lastSegment} = useParams();

  const liked_uris: any = [];  

  const inLikedSongs = (lastSegment === 'likedsongs');

  const [searchParams] = useSearchParams();  

  const navigate: any = useNavigate();
  
  const type = searchParams.get("type") ?? "";

  const inCategory = ["category"].includes(type);

  const inSearch = ["search"].includes(type);
  
  const [loading, setLoading] = useState(true);  
  const [removeSong] = useDeleteNewLikedMutation();
  const [modal, setModal] = useState(false);
  const [trackData, setTrackData] = useState(null);
  const [snack, setSnack] = useState(false);
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [tplaylist, setTplaylist] = useState<any>([]);
  const [filter_val, setFilter_val] = useState<string>('');
  
  const {data: liked = []} = useGetLikedQuery();
  const {data: storePlaylists = [], refetch} = useGetPlaylistsQuery();

  const {is_active, playerState} = useContext(UsePlayerContext);

  const cachedPlaylist = useMemo(() => {
    return storePlaylists.find(playlist => playlist.playlist_id === lastSegment);
  }, [storePlaylists, lastSegment]);

  const exitingSong = useAppSelector(state => state.defaultState.exitingSong);
  
  const fetchpTracks = async () => {                            
    const resp = await spotifyStreamRequest(`/ptracks/${lastSegment}`);

    setTplaylist({uri: "spotify:playlist:" + lastSegment});

    setLoading(false);
    
    const reader = resp?.body?.getReader();

    const decoder = new TextDecoder();

    let buffer: any = "";

    while (true) {
      const { value, done }: any = await reader?.read();
      if (done) break;

      const chunk = decoder.decode(value, {stream: true});          

      buffer += chunk;

      let lines = buffer.split("\n");

      buffer = lines.pop();

      for (const line of lines) {
        if (line.trim() === "") continue;

        const obj = JSON.parse(line);                                              

        setTplaylist((prev: any) => {
          const {uri, tracks = []} = prev;

          return {uri, tracks: [...tracks, ...obj.items]};
        });
      }
    }
  };

  useEffect(() => {                   
    if (inLikedSongs) {
      setTplaylist(liked);

      setLoading(false);
    } else if (cachedPlaylist) {
      setTplaylist(cachedPlaylist);

      setLoading(false);
    } else if (inCategory) {      
      setTplaylist({tracks: JSON.parse(sessionStorage.getItem("cplaylist")!)});

      setLoading(false);
    } else {        
      fetchpTracks();
    }                    
  },[cachedPlaylist, lastSegment]);
  
  const spinComponent = () => {
    const fullCustom = (!tplaylist?.images?.length && !inCategory && !inSearch && tplaylist?.tracks?.length > 3);    

    const spinPayload = {
      active: is_active,
      paused: playerState.is_paused,
      ...(inLikedSongs 
        ? {url: stockImage} 
        : fullCustom ? {custom: customImage(tplaylist)} : {url: returnUrl(tplaylist!)}
      ), 
    };

    return Spin(spinPayload);
  };

  const playlistName = () => {
    return (
      <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{inLikedSongs ? "Liked Songs" : tplaylist?.name ?? sessionStorage.getItem("playlist_name")}</h2>
    );
  };

  const playlistType = () => {
    return (
      <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
    );
  };

  const playlistMetadata = () => {
    return (
      <h5 style={{color: 'rgb(90, 210, 216)'}}>
        {tplaylist!.tracks?.filter((track: any) => track.name?.toLowerCase().includes(filter_val.toLowerCase())).length
          + " Song(s) • "
          + msToReadable(tplaylist!.tracks?.reduce((acc: number, item: any) => {
              acc += Number(item.duration_ms);
              
              return acc;
            }, 0)
          )}
      </h5>
    );
  };

  const addToLibrary = () => {
    return (
      <AddToLibrary 
        onClick={async () => {
          if (!cachedPlaylist) {                       
            await spotifyRequest('/users/playlist', "POST", {
              body: JSON.stringify({id: lastSegment,name: sessionStorage.getItem("playlist_name"), images: JSON.parse(sessionStorage.getItem("fullp_image")!)})
            });

            refetch();

            setSnack(true);
          } else {                                        
            setSnack(true);

            deletePlaylist({pID: lastSegment!});   
            
            navigate(-1, {replace: true});
          }                                        
        }}
      >
        {!cachedPlaylist ? "+" : "✓"}
      </AddToLibrary>
    );
  };

  const dropdown = () => {
    return (
      <CustomDropdown margin="10px">
        {playlistSort(tplaylist!, setTplaylist)}
      </CustomDropdown>
    );
  };

  const columnTitles = () => {
    return (
      <div className="subTdContainer" style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
        <span className="lolP2">Title</span>

        <span className="lolP">Duration</span>
      </div>
    );
  };

  const renderPlaylists = () => {      
    const content = document.getElementById('dropdown-content2')!;

    if (content) content.style.display = 'none'; 
    
    const filterFunction = (track: any) => track.name?.toLowerCase().includes(filter_val.toLowerCase());
    
    return tplaylist?.tracks?.filter(filterFunction).map((track: any, index: number) => {
      liked_uris.push(track.uri);

      const removeLikedButton = () => {
        return (
          <button 
            style={{
              color: 'black',background: 'rgb(90, 210, 216)', fontSize: '15px', width: '100px', 
              height: 'fit-content', borderRadius: '10px', padding: '5px'
            }} 
            onClick={() => {  
              setSnack(true)
            
              setTimeout(() => {
                removeSong({name: track.name}); 
              }, 300);
            }}
          >
            Remove From Liked Songs
          </button>
        );
      };

      return (
        <div 
          key={track.uri.split(':').pop()} 
          style={{
            display: 'flex', alignItems: 'center',
            ...(track.uri === exitingSong ? {animation: 'fadeOut 0.25s ease-in-out'} : {animation: 'fadeIn 0.25s ease-in-out'}),
          }}
        >        
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>                                
            <div className="removeContainer2" id="removeContainer2" style={{position: 'relative'}}>
              <div className="removeAlbum2" id="removeAlbum2">
                <button 
                  type="button" 
                  tabIndex={0} 
                  style={{
                    color: 'black',background: 'rgb(90, 210, 216)', fontSize: '15px', width: '100px', 
                    height: 'fit-content', borderRadius: '10px'
                  }} 
                  onClick={() => {  
                    setTrackData(track);

                    setModal(true);                                     
                  }}
                >
                  Edit Playlists
                </button>

                {lastSegment === 'likedsongs' && removeLikedButton()}
              </div>

              <img 
                src={dots} 
                className="removeImg2"
                onClick={() => {
                  setTrackData(track);

                  setModal(true);                  
                }} 
              />      
            </div>          

            <img 
              className="uPlaylistImgs" 
              src={track.images.find((image: any) => image.height == 64)?.url} 
              style={{height: '64px', width: '64px', borderRadius: '10px', marginBottom: '18px'}}
            />
          </div>
          
          <PTrack 
            uri={tplaylist.uri}
            name={track.name}
            number={index}
            duration={track.duration_ms}
            liked={liked_uris}
            artist={track.artists}
            t_uri={track.uri}          
            paused={playerState.is_paused}
          />                
        </div>
      );    
    });  
  };

  const editPlaylist = () => {
    return (
      <EditPlaylist track={trackData} boolVal={modal} setbool={setModal} setsnack={setSnack} />
    );
  };

  const snackbar = () => {
    return (
      <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>
    );
  };

  if (loading) return Spin3();

  return (
    <>        
      <div style={{marginBottom: '150px'}}>                    
        {spinComponent()}
                    
        <div style={{marginBottom: '60px', marginTop: '40px'}}>  
          {playlistName()}

          <div className="desc2" style={{display: 'flex', marginRight: '10px', alignItems: 'center'}}>
            {playlistType()}

            {playlistMetadata()}

            {(!inLikedSongs && !inCategory) && addToLibrary()}

            {dropdown()}                            
          </div>

          <div className="filterContainer">{filterTracks(setFilter_val)}</div>                            

          <div className="tdContainer" style={{width: '85vw'}} >
            {columnTitles()}

            {renderPlaylists()}
          </div>
              
        </div>        
      </div>            

      {modal && editPlaylist()}
      
      {snack && snackbar()}
    </>
  );
};
