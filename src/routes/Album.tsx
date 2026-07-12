//Session storage vars ref_id and ref_items created here
//import './Album.css';
import styles from './Album.module.css';
import { useState, useEffect, useContext, useMemo } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Spin, Spin3 } from "../components/Spin/Spin.tsx";
import { useGetAlbumsQuery, useAddAlbumMutation,useDeleteAlbumMutation } from "../App/ApiSlice.ts";
import Track from "../components/Track/Track.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import { filterTracks } from "../components/filterTracks.tsx";
import { spotifyRequest, msToReadable } from '../utils/utils.ts';
import { useAppSelector, useAppDispatch } from '../App/hooks.ts';
import { setCurrentAlbum } from '../App/defaultSlice.ts';
import { AddToLibrary } from '../helpers/AddToLibrary.tsx';
import { useResponsive } from '../hooks/ResponsiveContext.tsx';

export default function Album() {
  const currentAlbum = useAppSelector(state => state.defaultState.currentAlbum);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const parts = window.location.href.split('/');

  const lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash    
  
  const zip = currentAlbum.artists.map((e: any, i: number) => {
    return [e, currentAlbum.artist_ids[i]];
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [addAlbum] = useAddAlbumMutation();
  const [deleteAlbum] = useDeleteAlbumMutation();
  const [artists, setArtists] = useState<any>([]);
  const [artistIds, setArtistIds] = useState<string[]>([]);
  const [talbum, setTAlbum] = useState<any>([]);
  const [snack, setSnack] = useState(false);
  const [modal, setModal] = useState(false);
  const [trackData, setTrackData] = useState<any>(null);
  const [filter_val, setFilter_val] = useState<string>('');
  const [discog, setDiscog] = useState<any>({});

  const {is_active, playerState} = useContext(UsePlayerContext);

  const {isMobile} = useResponsive();
  
  const {data: storeAlbums = []} = useGetAlbumsQuery();  

  const cachedAlbum = useMemo(() => {
    return storeAlbums.find(album => album.album_id === lastSegment);
  }, [storeAlbums, lastSegment]);
  
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      setIsLoading2(true);

      try {
        let resolvedAlbum: any;
        let resolvedArtists: any;
        let ids: string[] = [];

        if (cachedAlbum) {
          resolvedAlbum = cachedAlbum;

          ids = (cachedAlbum?.artists ?? []).map((a: any) => a.id);

          const data = await spotifyRequest(`/tracks/artists`, "POST", {body: JSON.stringify(ids)});

          if (ignore) return;

          resolvedArtists = data;
        } else {          
          const data = await spotifyRequest(`/tracks/${lastSegment}`);

          if (ignore) return;

          resolvedAlbum = data.album;          

          ids = (data?.album?.artists ?? []).map((a: any) => a.id);

          resolvedArtists = {images: data.images};
        }

        if (ignore) return;

        setTAlbum(resolvedAlbum);

        setArtists(resolvedArtists);

        setArtistIds(ids);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [lastSegment]);  

  useEffect(() => {
    let ignore = false;

    if (!artistIds.length) return;

    const loadDiscog = async () => {
      const data = await spotifyRequest(`/artists2/albums/${artistIds.join(",")}`);

      setIsLoading2(false);

      if (!ignore) {
        setDiscog(data);
      }
    };

    loadDiscog();

    return () => {
      ignore = true;
    };
  }, [artistIds]);

  const albumName = () => {
    return (
      <h2 style={{fontSize: '30px', alignSelf: 'center'}} >{talbum?.name}</h2>
    );
  };

  const artistNames = () => {
    return (
      <h2 className={styles.artistName}>
        {zip.map((artist: any, index: number, row: any) =>
          <a 
            key={index}  
            onClick={() => {
              navigate(`/app/artist/${artist[1]}`);
            }}
          >
            {row.length - 1 !== index ? artist[0] + ", " : artist[0]}
          </a>             
        )}
      </h2>
    );
  };

  const metadata = () => {
    return (
      <div className={styles.innerDescription}>
        <h5 className={styles.desc1}>{talbum?.album_type === 'single' && talbum?.total_tracks > 1 ? 'EP' : (talbum?.album_type ?? "").toUpperCase() } &#8226;</h5>

        <h5>{talbum?.tracks?.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).length 
          + " Song(s) • "
          + msToReadable(talbum?.tracks?.items.reduce((acc: any, item: any) => {
            acc += item.duration_ms;

            return acc;
          }, 0)) 
        }</h5>              
      </div>
    );
  };

  const artistLogos = (metadata = false) => {
    const attrs = metadata ? {className: styles.tinyArtist} : {style: {width: '90px', height: '90px', borderRadius: '10px'}};

    return artists?.images?.map((image: any, i: any) => 
      <img 
        key={i}          
        src={image.find((b: any) => b.height > 160).url} 
        {...attrs}
      />
    );
  };

  const addToLibrary = () => {
    return (
      <AddToLibrary 
        onClick={(e) => {
          setSnack(true);

          if (!cachedAlbum){      
            addAlbum({album_type: talbum?.album_type, total_tracks: talbum?.total_tracks, album_id: lastSegment!, images: talbum?.images, name: talbum?.name, 
              release_date: talbum?.release_date, uri: talbum?.uri, artists: talbum?.artists, tracks: talbum?.tracks, 
              copyrights: talbum?.copyrights, label_name: talbum?.label_name, date_added: new Date().toISOString()});                    
          } else {                                        
            deleteAlbum({aID: lastSegment!});                                                    
          }                  
        }}
      >
        {!cachedAlbum ? "+" : "✓"}
      </AddToLibrary>
    );
  };

  const trackHeaders = () => {
    return (
      <div style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
        <span className={styles.uTitle}>Title</span>

        {!isMobile && <span style={{marginLeft: '30px', position: 'absolute', top: '0', left: '60%'}} className={styles.uTitle}>Plays</span>}


        <span className={styles.uTitle2}>Duration</span>
      </div>
    );
  };
    
  const itemsList = talbum?.tracks?.items.filter((track: any)=> track.name.toLowerCase().includes(filter_val.toLowerCase())).map((track: any, i: any) => {
    const handleClick = () => {
      const payload = {images: talbum?.images, uri: track.uri, name: track.name, track_number: 0, duration_ms: track.duration_ms, artists: track.artists};

      setTrackData(payload);

      setModal(true); 
    };

    const attrs = isMobile ? {customWidth: 95} : {};
    
    return (
      <div className={styles.listContainer} key={i}>                
        <div className={styles.removeContainer3} id="removeContainer3" style={{position: 'relative'}}>
          <button 
            className={styles.removeAlbum3} 
            onClick={() => handleClick()}
          >
            Edit Playlists
          </button>

          <img 
            src={dots} 
            className={styles.removeImg2} 
            onClick={() => handleClick()}
          />            
        </div>

        <Track 
          uri={talbum?.album_id ? `spotify:album:${talbum.album_id}` : talbum.uri}
          name={track.name}
          number={track.track_number}
          duration={track.duration_ms}
          album_name={null}
          artist={track.artists}
          t_uri={track.uri}        
          paused={playerState.is_paused}
          {...attrs}
        />
      </div>
    );    
  });

  const labelMetadata = () => {
    return (
      <>
        <h5 style={{textAlign: isMobile ? 'center' : 'left',color: 'rgb(90, 210, 216)'}}>Release Date: {talbum?.release_date}</h5>

        <h5 style={{textAlign: isMobile ? 'center' : 'left',color: 'rgb(90, 210, 216)'}}>{ talbum?.copyrights?.[0]?.text} </h5>

        <h5 style={{textAlign: isMobile ? 'center' : 'left',color: 'rgb(90, 210, 216)'}}>(R) {talbum?.label_name ?? talbum?.label}</h5>
      </>
    );
  };

  const showDiscog = (discography: []) => {
    const handleClick = (discog: any) => {
      const found = (storeAlbums?.find((e: any) => 
        e?.album_id === discog.id) || (storeAlbums?.find((e: any) => e?.name === discog.name))
      );  
            
      if (found) {
        if (discog.id !== found?.album_id) {
          found?.album_id;
        }                  
      }
      
      sessionStorage.setItem("image", discog.images.find((b: any) => b.height > 160).url);
      
      dispatch(setCurrentAlbum({
        image: discog.images.find((b: any) => b.height > 160).url,
        artists: discog.artists.map((t: any) => t.name),
        artist_ids: discog.artists.map((t: any) => t.uri.split(':').pop()),
      }));

      sessionStorage.setItem("artist", JSON.stringify(discog.artists.map((t: any) => t.name)));

      sessionStorage.setItem(
        "artist_id", 
        JSON.stringify(
          discog.artists.map((t: any) => t.uri.split(':').pop())
        ),
      );

      navigate(`/app/album/${discog.id}`);
    };

    return (
      <div style={{display: 'flex', gap: '25px'}} >
        {discography?.map((discog: any, i: number) =>                
          <a 
            className={styles.discog}
            key={i} 
            style={{display: 'flex', flexDirection: 'column', gap: '10px'}} 
            onClick={() => handleClick(discog)}
          >
            <img key={i} src={discog.images.find((b: any) => b.height > 160).url} style={{width: isMobile ? '100px' : '150px', height: isMobile ? '130px' : '190px', borderRadius: '10px'}}/>

            <span style={{color: 'rgb(90, 210, 216)', ...isMobile ? {fontSize: '13px'} : {}}}>{discog.name}</span>

            <span style={{color: 'rgb(90, 210, 216)', ...isMobile ? {fontSize: '13px'} : {}}}>{discog.release_date}</span>           
          </a>                    
        )}        
      </div>
    );
  };

  const discogContainer = () => {
    return zip.map((zID: any, i: number) => 
      <div key={i}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h5 style={{fontSize: isMobile ? '15px' : '20px', color: 'rgb(90, 210, 216)'}}>More by {zID[0]}</h5>

          <h5 className={styles.discogMore} style={{fontSize: isMobile ? '15px' : '20px', color: 'rgb(90, 210, 216)', cursor: 'pointer'}} onClick={() => {navigate(`/app/artist/${zID[1]}`);}}>See discography</h5>
        </div>

        <div style={{overflowX: 'auto'}}>
          {showDiscog(discog[zID[1]])}
        </div>        
      </div>
    );
  };

  const editPlaylist = () => {
    return (
      <EditPlaylist 
        track={trackData} 
        boolVal={modal} 
        setbool={setModal} 
        setsnack={setSnack} 
      />
    );
  };

  const snackbar = () => {
    return (
      <MySnackbar 
        state={snack} 
        setstate={setSnack} 
        message="Changes Saved"
      />
    );
  };

  //if (isLoading) return Spin3();
  
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'start' : 'center', minWidth: isMobile ? '100%' : '99vw', maxWidth: '100%', marginBottom: '150px', overflow: 'hidden'}}>                      
      {albumName()}
        
      {/* Spin Component import now instead of prop */}      
      <div style={{marginLeft: '10px'}}>{Spin({active: is_active, paused: playerState.is_paused, url: currentAlbum.image})}</div>

      {artistNames()}

      {isLoading ? Spin3() : <div style={{width: isMobile ? '95%' : '90%'}}>
        <div className={styles.albumDescription}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            {metadata()}            

            {artistLogos(true)}

            {addToLibrary()}
          </div>
          
          {filterTracks(setFilter_val)}
        </div>                                      
        
        <div className={styles.tdContainer}>
          {trackHeaders()}

          {itemsList}
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'start'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '50px', marginBottom: '50px'}}>
            {artistLogos()}
          </div>
          
          {labelMetadata()}
        </div>

        {isLoading2 ? Spin3() : discogContainer()}                                        

        {modal && editPlaylist()}

        {snack && snackbar()}
      </div>}
    </div>
  );
};