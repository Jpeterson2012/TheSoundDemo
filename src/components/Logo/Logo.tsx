import styles from './Logo.module.css';
import 'react-responsive-modal/styles.css';
import { useGetUserQuery,useGetAlbumsQuery, useGetPlaylistsQuery } from '../../App/ApiSlice';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { useState, useEffect, useContext, useRef } from 'react';
import Track from '../Track/Track';
import search from '../../images/search.png';
import keyboard from '../../images/music.gif';
import logo from '../../images/logo.png';
import UsePlayerContext from '../.././hooks/PlayerContext.tsx';
import { spotifyRequest } from '../../utils/utils.ts';
import { closeIcon } from '../../helpers/CloseIcon.tsx';
import { useAppDispatch } from '../../App/hooks.ts';
import { setCurrentAlbum } from '../../App/defaultSlice.ts';
import InfiniteObserver from '../../helpers/InfiniteObserver.tsx';
import { useResponsive } from '../../hooks/ResponsiveContext.tsx';

function getTracks(ptracks: any) {
  return (    
    ptracks.map((track:any, index:any) =>  
      <div 
        className='logoTracks fade-in-image' 
        style={{display: 'flex', alignItems: 'center', fontSize: '20px'}} 
        key={index}
      >            
        <img 
          src={track.images.filter((image:any) => image.height == 64).map((image:any) => image.url)} 
          style={{height: '64px', width: '64px', borderRadius: '5px'}}
        />

        <Track 
          uri={track.url}
          name={track.name}
          number={track.track_number}
          duration={track.duration_ms}
          album_name={track.album_name}
          artist={track.artists}
          show={false}
        />        
      </div>
    )
  );
};

function getAlbums(storeAlbums: any, albums: any, nav: any, close: any, dispatch: any) {
  const handleAlbumClick = (album: any) => {
    const found = storeAlbums?.find((e: any) => e?.album_id === album.id);

    const artistNames = album.artists.map((a: any) => a.name);
    const artistIDs = album.artists.map((a: any) => a.id);

    dispatch(
      setCurrentAlbum({
        image: album.images.find((i: any) => i.height === 300)?.url,
        artists: artistNames,
        artist_ids: artistIDs,
      })
    );

    nav(`/app/album/${album.id}`);

    close();
  };

  return (
    albums.map((album:any) =>
      <a 
        key={album.id} 
          onClick={() => handleAlbumClick(album)}
      >
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
          <img src={album.images.find((image: any) => image.height === 64)?.url} style={{height: '64px', borderRadius: '5px'}}/>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div>{album.name}</div>

            <div>{album.artists.map((artist:any) => artist.name + " ")}</div>
          </div>            
        </div>
      </a>
    )    
  );
};

function getArtists(artists: any, nav: any, close: any) {
  return (
    artists.map((artist:any) => 
      <a 
        key={artist.id} 
        onClick={() => {
          nav(`/app/artist/${artist.id}`);

          close();
        }}
      >
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>          
          <img 
            src={!artist.images?.length ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' : artist.images[2]?.url} 
            alt={artist.name} 
            style={{height: '64px', width: '64px', borderRadius: '5px'}} 
          />

          {artist.name}
        </div>
      </a>
    )
  );
};

function getPlaylists(playlists: any, plists: any, nav: any, close: any){
  return (
    plists.map((playlist: any) =>
      <div key={playlist.id}>
        <a onClick={() => {
          sessionStorage.removeItem("cplaylist");

          let found = playlists?.find((e: any) => e?.playlist_id === playlist.id)

          sessionStorage.setItem("uplist", found ? "true" : "false");

          sessionStorage.setItem("playlist_name", playlist.name);

          sessionStorage.setItem("fullp_image", JSON.stringify(playlist.images));

          sessionStorage.setItem("p_image", playlist.images.length == 1 ? playlist.images.map((s:any) => s.url) : playlist.images.filter((s:any) => s.height == 60).map((s:any) => s.url));

          nav(`/app/playlist/${playlist.id}?type=search`);

          close();
        }}>
          <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
            <img 
              src={playlist.images?.length == 1 ? playlist.images?.map((s:any) => s.url) : playlist.images?.filter((s:any) => s.height == 60).map((s:any) => s.url)} 
              alt={playlist.name} 
              style={{height: '64px', width: '64px', borderRadius: '5px'}}
            />

            {playlist.name}
          </div>
        
          <br></br>
        </a>      
      </div>
    )
  );
};

let counter = 0;

export default function Logo () {
  const dispatch = useAppDispatch();

  const navigate: any = useNavigate();

  const selectorRef = useRef(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [html, setHtml] = useState<any>(null)
  const [tracks, setTracks] = useState<any>([]);
  const [albums, setAlbums] = useState<any>([]);
  const [plist, setPlist] = useState<any>([]);
  const [artist, setArtist] = useState<any>([]);
  const {data: storeAlbums = []} = useGetAlbumsQuery();
  const {data: playlists = []} = useGetPlaylistsQuery();    
  const [activeButton, setActiveButton] = useState<string>("tracks");

  const [open, setOpen] = useState(false);        
  const onOpenModal = () => {setOpen(true)};
  const onCloseModal = () => {setOpen(false); setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); setIsLoading(false); counter = 0};
  
  const {resetPlayer} = useContext(UsePlayerContext);

  const {isMobile} = useResponsive();

  const buttonNames = ["tracks", "albums", "artists", "playlists"];

  const capitalize = (str: any) => {return str.charAt(0).toUpperCase() + str.slice(1)};

  const fetchSearch = async () => {        
    try {      
      const data = await spotifyRequest(`/search/${(document.getElementById("searchTerm") as HTMLInputElement).value},${counter}`)
       
      if (counter){
        setTracks((prev: []) => [...prev, ...data.tracks]);
        
        setAlbums((prev: []) => [...prev, ...data.albums]);
                
        setArtist((prev: []) => [...prev, ...data.artists]);
                
        setPlist((prev: []) => [...prev, ...data.playlists]);
      }
      else{
        setTracks([...data.tracks]);

        setAlbums([...data.albums]);

        setArtist([...data.artists]);

        setPlist([...data.playlists]);
      }
    } catch (err) {
      console.log(err);
    }               
  };

  const {data: user, isSuccess} = useGetUserQuery();
  
  useEffect(() => {         
    switch(activeButton) {
      case 'tracks':
        setHtml(getTracks(tracks));

        break;

      case 'albums':
        setHtml(getAlbums(storeAlbums, albums, navigate, onCloseModal, dispatch));

        break;
      case 'artists':
        setHtml(getArtists(artist, navigate, onCloseModal));

        break;
      case 'playlists':
        setHtml(getPlaylists(playlists, plist, navigate, onCloseModal));

        break;
      default:
        setHtml(getTracks(tracks));
    };
  }, [tracks]);

  function listRecent() {     
    const recentlyPlayed = JSON.parse(localStorage.getItem("recent")!);        

    if (recentlyPlayed && !isMobile) {                      
      const recents = Object.keys(recentlyPlayed).reduce<any>((acc, recent) => {
        acc.push({
          "id": recentlyPlayed[recent].id,
          "name": recentlyPlayed[recent].name,
          "artists": recentlyPlayed[recent].artists,
          "img": recentlyPlayed[recent].images.filter((t: any) => t.height == 640)[0],
        });

        return acc;
      }, []);

      return (
        <div 
          style={{
            display: 'flex', flexDirection: 'column', position: 'fixed', right: '0', top: '0', maxHeight: '92%', 
            overflowY: 'auto', padding: '3px', background: 'linear-gradient(to bottom, #0066ff 0%, #cc33ff 100%)',
          }}
        >
          {recents.map((recent: any,i: number) => 
            <div key={i}>        
              <a onClick={() => {
                const found = (storeAlbums?.find((e: any) => e?.album_id === recent.id) || (storeAlbums?.find((e: any) => e?.name === recent.name)));                                                                

                if (found && recent.id !== found?.album_id) {
                  recent.id = found?.album_id;
                }

                const artistMetadata = recent.artists.reduce((acc: any ,artist: any) => {
                  acc.names.push(artist.name);

                  acc.ids.push(artist.uri.split(':').pop() as string);

                  return acc;
                }, {names: [] as string[], ids: [] as string[]});
                
                dispatch(setCurrentAlbum({
                  image: recent.img.url,
                  artists: artistMetadata.names,
                  artist_ids: artistMetadata.ids,
                }));

                navigate(`/app/album/${recent.id}`);
              }}>                
                <img className={styles.recents} key={i} src={recent.img.url} style={{width: '43px', height: '43px', borderRadius: '5px'}}/>           
              </a>          
            </div>
          )}
        </div>
      );
    }

    return (
      <>
      </>
    );    
  };

  const userNameRender = () => {
    return (
      <button 
        className={styles.userName}
        style={{
          cursor: 'pointer',
          ...(isMobile && {backgroundColor: 'rgb(90, 210, 216)', fontSize: '13px', borderRadius: '50%'}),
        }} 
        onClick={() => {
          resetPlayer();

          navigate('/', {replace: true});              
        }}
      >
        {isSuccess ? user!.name : ''}
      </button>
    );
  };

  const navigateBack = () => {
    return (
      <h2 
        className={styles.navIcon1} 
        onClick={() => {
          if (window.history?.length && window.history.length > 1) navigate(-1, {replace: true});

          else navigate('/app/', {replace: true});
        }}
      >
        {"<"}
      </h2>
    );
  };

  const searchLogo = () => {
    return (
      <img 
        className={styles.searchimg} 
        src={search} 
        onClick={() => {onOpenModal()}}
      />
    );
  };

  const navigateForward = () => {
    return (
      <h2 
        className={styles.navIcon2} 
        onClick={() => {
          if (window.history?.length && window.history.length > 1) navigate(1, {replace: true});

          else navigate('/app/', {replace: true});
        }}
      >
        {">"}
      </h2>
    );
  };

  const discoverButton = () => {
    return (
      <button className={styles.Discover} onClick={() => {navigate('/app/discover')}}>Discover</button>
    );
  };

  const theSoundLogo = () => {
    return (
      <a onClick={(() => {navigate('/app')})}>
        <img className={styles.logoIcon} src={logo} alt="Avatar" onClick={(() => {navigate('/app')})}/>
      </a>
    );
  };

  const searchBar = () => {
    return (
      <input 
        type="text" 
        className={styles.searchTerm} 
        id='searchTerm'  
        placeholder="What are you looking for?" 
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0;
          
            let t = document.getElementById('modalbuttons')!;
            t.style.display = 'flex';
            t.style.animation = 'fadeIn 0.5s';

            fetchSearch();

            return;
          }
        }}
      />
    );
  };

  const searchButton = () => {
    return (
      <button 
        type="button" 
        className={styles.searchButton} 
        onClick={() => {                    
          setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0;
          
          let t = document.getElementById('modalbuttons')!;
          t.style.display = 'flex';
          t.style.animation = 'fadeIn 0.5s';

          fetchSearch();

          return;
        }}
      >
        <i className="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}}></i>
      </button>
    );
  };

  const headerGif = () => {
    return (
      <img 
        src={keyboard} 
        style={{zIndex: '0', width: '100%', height: '180px', position: 'fixed', top: '0', left: '0', opacity: '0.3', objectFit: 'cover', objectPosition: '20% 50%'}}
      />
    );
  };

  const searchCategories = () => {
    return (
      <div id='modalbuttons' style={{display: 'none', justifyContent: 'center', zIndex: '9', position: 'absolute', top: '120px', left: '50%', right: '50%'}}>
        {buttonNames.map((name: string, index: number) =>
          <button 
            key={index}
            style={{
              color: 'black', fontWeight: '900', fontFamily: 'math',
              ...(activeButton === name ? {background: 'rgb(90, 210, 216)'} : {background: '#7a19e9'}),
              ...(name === "tracks" ? {borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'} : {}),
              ...(name === "playlists" ? {borderTopRightRadius: '10px', borderBottomRightRadius: '10px'} : {})
            }}
            onClick={() => {
              setActiveButton(name);

              switch (name) {
                case "tracks":
                  setHtml(getTracks(tracks));
                  break;
                case "albums":
                  setHtml(getAlbums(storeAlbums,albums, navigate, onCloseModal, dispatch));
                  break;
                case "artists":
                  setHtml(getArtists(artist, navigate, onCloseModal));
                  break;
                case "playlists":
                  setHtml(getPlaylists(playlists,plist, navigate, onCloseModal));
                  break;
                default:
                  return;
              };                                    
            }}
          >
            {capitalize(name)}
          </button>
        )}                
      </div>
    );
  };

  const spinner = () => {
    return (
      <div 
        style={{
          width: '24px',
          height: '24px',
          border: '4px solid rgb(90, 210, 216)',
          borderTop: '4px solid #7a19e9',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '10px 5px 0px',
        }}
      />
    );
  };

  const itemsList = () => {
    return (
      <div                 
        className={styles.logoModal} 
        style={{maxWidth: '55vw', textOverflow: 'ellipsis', whiteSpace: 'nowrap', position: 'relative', overflowY: 'auto', top: '170px', paddingBottom: '20px'}}
      >
        {html ?? getTracks(tracks)}               
        
        {isLoading && spinner()}
      </div>
    );
  };

  return(
    <>
      {isSuccess &&     
        <>
        {listRecent()} 

        <div className={styles.mainLogo}>          
          {userNameRender()}         

          {!isMobile && <div></div>} 

          {navigateBack()}

          {searchLogo()}

          {navigateForward()}
          
          {discoverButton()}   
                          
          {theSoundLogo()}
                    
          <Modal 
            ref={selectorRef}
            modalId='modal3' 
            open={open} 
            onClose={onCloseModal} 
            center 
            closeIcon={closeIcon()}
            styles={{
              modal: {
                minWidth: '85vw',
                minHeight: '90vh',     
                maxHeight: '90vh',                                             
                background: 'rgb(33, 33, 33)',                
              },
            }}
          >
            <InfiniteObserver
              root={selectorRef.current}
              rootMargin="300px"
              disabled={isLoading || !tracks.length}
              onIntersect={async (obj: IntersectionObserverEntry) => {
                //if (counter > 29) return;
                //console.log(obj);

                setIsLoading(true);                                

                counter += 20;

                //await new Promise(resolve => setTimeout(resolve, 500));  
                
                await fetchSearch();                                    

                setIsLoading(false);                
              }}
            >
              <div className={styles.wrap}>
                <div className={styles.search}>
                  {searchBar()}

                  {searchButton()}
                </div>
              </div>

              {headerGif()}

              {searchCategories()}

              {itemsList()}
              </InfiniteObserver>                      
          </Modal>          
        </div>
        </>
      }
    </>
  );
};