//sessionstorage items created: cusername, albums, playlist_name, albumSortValue, playlistSortValue
import './Home.css'
import 'react-responsive-modal/styles.css';
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { imageRender } from "../components/ImageRender/ImageRender.tsx";
import { useGetAlbumsQuery, useGetPlaylistsQuery, useGetAudiobooksQuery, useGetPodcastsQuery, useDeleteAlbumMutation, useDeletePlaylistMutation } from "../App/ApiSlice.ts";
import Card from "../components/Card/Card.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import dots from '../images/dots.png'
import Loading from '../components/Loading/Loading.tsx';
import Loading3 from '../components/Loading3/Loading3.tsx'
import { spotifyRequest, stockImage } from '../utils/utils.ts';
import { closeIcon } from '../helpers/CloseIcon.tsx';
import { useAppDispatch } from '../App/hooks.ts';
import { setCurrentAlbum } from '../App/defaultSlice.ts';
import CustomDropdown from '../helpers/CustomDropdown/CustomDropdown.tsx';
import { useResponsive } from '../hooks/ResponsiveContext.tsx';

function generatePassword() {
  const length = 22;

  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let retVal = "";

  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
};

function Albums(listRecent:any, listItems: any) {
  return(
    <div style={{marginTop: '100px'}}>
      <p style={{fontWeight: 'bolder', fontSize: '25px'}} >{JSON.parse(localStorage.getItem("recent")!) && "Jump Back In"}</p>

      <div style={{maxWidth: '95vw', overflowX: 'auto', marginBottom: '50px'}}>        
        {listRecent}
      </div>

      <div className="albumContainer">      
        {listItems}
      </div>
    </div>
  );
};

function albumSort(setSorted: any){
  const buttonText = ["A-Z", "Z-A", "Artist A-Z", "Artist Z-A", "Oldest", "Newest"];

  return(
    <>
      {buttonText.map((button, index) =>
        <button 
          key={index}
          className="theme" 
            onClick={(e) => {
              setSorted(index + 1);

              sessionStorage.setItem('albumSortValue', (index + 1).toString());
            }}
        >
          {button}
        </button>
      )}
    </>
  );
};

function Playlists(navigate: any, listPlaylists: any){
  return(
    <div className="playlistContainer">
      <a 
        onClick={() => {
          sessionStorage.setItem("uplist", "true");

          navigate('/app/playlist/likedsongs');
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', animation: 'fadeIn 0.5s', marginLeft: '40px'}}>
          <img className="likedSongImg" src={stockImage} alt="Liked Songs"/>

          <h2>Liked Songs</h2>
        </div>
      </a>

      {listPlaylists}
    </div>
  );
};

function playlistSort(setPSorted: any){
  const buttonText = ["A-Z", "Z-A"];

  return(
    <>
      {buttonText.map((button, index) => 
        <button 
          key={index}
          className="theme" 
          onClick={() => {                              
            setPSorted(index + 1);

            sessionStorage.setItem('playlistSortValue', (index + 1).toString());
          }}
        >
          {button}
        </button>
      )}
    </>
  );
};

function Podcasts(podcasts:any){
  const listItems = podcasts?.items.map((podcast: any, i: any) =>
    <a 
      key={i} 
      onClick={() => {
        const deviceId = sessionStorage.getItem("device_id");

        spotifyRequest(`/player/playback/${deviceId}`, 'POST', {
          body: JSON.stringify({context_uri: podcast.show.uri})
        });
      }}
    >
      <div className="audioPodcast">
        <img className="fade-in-image2" src={podcast.show.images.length === 1 
            ? podcast.show.images.map((image: any) => image.url) 
            : podcast.show.images.find((image: any) => image.height == 300)?.url} alt={podcast.show.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>

        <h2>{podcast.show.name}</h2>
      </div>
    </a>
  )
  
  return(
    <div style={{marginTop: '10vw', paddingBottom: '100px'}}>
      {listItems}
    </div>    
  )
};

function Audiobooks(audiobooks:any){
  const listItems = audiobooks?.items.map((book: any,i: any) =>
    <a 
      key={i} 
      onClick={() => {              
        const deviceId = sessionStorage.getItem("device_id");

        spotifyRequest(`/player/playback/${deviceId}`, 'POST', {
          body: JSON.stringify({context_uri: book.uri})
        });
      }}
    >
      <div className="audioPodcast">
        <img className="fade-in-image2" src={book.images.length === 1 
            ? book.images.map((image: any) => image.url) 
            : book.images.find((image: any) => image.height == 300)?.url} alt={book.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>

        <h2>{book.name}</h2>
      </div>
    </a>
  );
  
  return(
    <div style={{marginTop: '10vw', paddingBottom: '100px'}}>      
      {listItems}
    </div>    
  );
};

export default function Home({setIsLoading2}: any) {  
  const buttonNames = ["Albums", "Playlists", "Podcasts", "AudioBooks"];

  const sessionButtonMapping: any = {"album": "Albums", "playlist": "Playlists", "podcast": "Podcasts", "audiobook": "AudioBooks"};

  const filterFuncton = (data: any) => [data.name, ...(data?.artists ?? []).map((artist: any) => artist.name)].some((name: string) => name.toLowerCase().includes(filter_val.toLowerCase()));

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  
  const [sorted, setSorted] = useState(Number(sessionStorage.getItem('albumSortValue') ?? 0));
  const [psorted, setPSorted] = useState(Number(sessionStorage.getItem('playlistSortValue') ?? 0));
  const [filter_val, setFilter_val] = useState<string>('');        
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opensnack, setOpensnack] = useState(false);
  const [activeButton, setActiveButton] = useState<string>(sessionButtonMapping[sessionStorage.getItem('activeHomeButton') ?? "album"]);
  
  const {data: albums = [],isSuccess: albumSuccess} = useGetAlbumsQuery();  
  const {data: podcasts, isSuccess: podSuccess} = useGetPodcastsQuery();
  const {data: audiobooks, isSuccess: audSuccess} = useGetAudiobooksQuery();
  const {data: playlists = [], isSuccess: playSuccess} = useGetPlaylistsQuery();    
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [deleteAlbum] = useDeleteAlbumMutation();    

  const {playerState} = useContext(UsePlayerContext);
  
  const {isMobile} = useResponsive();

  const onOpenModal = () => {setOpen(true)}
  const onCloseModal = () => {
    setOpen(false);

    let pform = document.getElementById('formPlaylist');

    pform?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.getElementById('first') as HTMLInputElement);
      const desc = (document.getElementById('second') as HTMLInputElement);
      const opt1 = (document.getElementById('option1') as HTMLInputElement);

      if (name!.value == "") console.error("Error");
      else{
        let pID = generatePassword();

        spotifyRequest("/users/playlist", "POST", {
          body: JSON.stringify({id: pID, name: name.value, description: desc.value === "" ? "null" : desc.value, public: opt1.checked})
        });        
      }
    });
  };

  const sorts: Record<number, Function> = {
    0: (a: any[]) => a,
    1: (a: any[]) => [...a].sort((x, y) => x.name.localeCompare(y.name)),
    2: (a: any[]) => [...a].sort((x, y) => y.name.localeCompare(x.name)),
    3: (a: any[]) => [...a].sort((x, y) => x.artists[0].name.localeCompare(y.artists[0].name)),
    4: (a: any[]) => [...a].sort((x, y) => y.artists[0].name.localeCompare(x.artists[0].name)),
    5: (a: any[]) => [...a].sort((x, y) => new Date(x.date_added).getTime() - new Date(y.date_added).getTime()),
    6: (a: any[]) => [...a].sort((x, y) => new Date(y.date_added).getTime() - new Date(x.date_added).getTime()),
  };
  
  const sortedAlbums = () => {

    const sortFn = sorts[sorted] ?? sorts[0];

    return sortFn(albums);
  };  
  
  const ready = albumSuccess && podSuccess && audSuccess && playSuccess;

  const sortedPlaylists = (() => {
    const sortFn = sorts[psorted] ?? sorts[0];

    return sortFn(playlists);
  });

  const pages: any = {
    Albums: () => Albums(listRecent(), isMobile ? listItemsMobile() : listItems()),
    Playlists: () => Playlists(navigate, listPlaylists),
    Podcasts: () => Podcasts(podcasts),
    AudioBooks: () => Audiobooks(audiobooks),
  };

  useEffect(() => {            
    (ready && !loading) && setIsLoading2(false);

    setLoading(false);
  }, [ready, sorted, psorted, filter_val, localStorage.getItem("recent")!, playerState.is_paused, isMobile]);

  const listItems = () => {              
    return sortedAlbums()?.filter(filterFuncton).map((album: any, index: any) =>
      <div key={index}>
        <div className="removeContainer" style={{width: '20px', position: 'relative'}}>
          <button 
            className="removeAlbum" 
            id={"removeAlbum" +  index} 
            onClick={() => {
              setOpensnack(true);

              document.getElementById('removeAlbum' + index)!.style.display = 'none';

              setTimeout(() => {deleteAlbum({aID: album.album_id})}, 300);
            }}
          >
            Remove
          </button>

          <img
            src={dots} 
            className="removeImg" 
            style={{marginBottom: '20px', transform: 'rotate(90deg)', height: '30px', width: '30px', margin: '0px', cursor: 'pointer'}} 
            onClick={() => {
              let album = document.getElementById('removeAlbum' + index)!;

              if (album.style.display === 'block') album.style.display = 'none';
              else {
                album.style.display = 'block'
              }
            }} 
          />      
        </div>

        <Card      
          id={album.album_id}
          uri={album.uri}
          image={album.images.find((image: any) => image.height == 300)?.url}
          name={album.name}
          artist={album.artists.map((artist: any) => artist.name)}
          a_id={album.artists.map((artist: any) => artist.id)}
          key={album.album_id}
          paused={playerState.is_paused}
        />
      </div>
    );
  };

  function chunkArray(array: any, size: any) {
    const chunkedArray = [];

    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }

    return chunkedArray;
  };
  
  function listItemsMobile() {
    const filteredAlbums = sortedAlbums()?.filter(filterFuncton);

    const rows = chunkArray(filteredAlbums, 10);

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((item: any, itemIndex: any) => (
          <div key={itemIndex} className="item">                
            <div className="removeContainer" style={{width: '20px', position: 'relative'}}>
              <button 
                className="removeAlbum" 
                id={"removeAlbum" +  (rowIndex * 10) + itemIndex} 
                onClick={() => {
                  setOpensnack(true);

                  document.getElementById('removeAlbum' + rowIndex * itemIndex + itemIndex)!.style.display = 'none';

                  setTimeout(() => { deleteAlbum({aID: item.album_id}) },300);
                }}
              >
                Remove
              </button>
              <img 
                src={dots} 
                className="removeImg" 
                style={{marginBottom: '20px', transform: 'rotate(90deg)', height: '30px', width: '30px', margin: '0px', cursor: 'pointer'}} 
                onClick={() => {                    
                  let album = document.getElementById('removeAlbum' + (rowIndex * 10) + itemIndex)!;

                  if (album.style.display === 'block') album.style.display = 'none';
                  else {
                    album.style.display = 'block'
                  }
                }} 
              />      
            </div>

            <Card      
              id={item.album_id}
              uri={item.uri}
              image={item.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
              name={item.name}
              artist={item.artists.map((t: any) => t.name)}
              a_id={item.artists.map((t: any) => t.id)}
              key={item.album_id}
              paused={playerState.is_paused}
            />                  
          </div>
        ))}
      </div>
    ));
  };
    
  const listPlaylists = sortedPlaylists()?.filter(filterFuncton).map((playlist: any, i: any) =>
    <div style={{display: 'flex', gap: '20px', alignItems: 'center'}} key={i}>
      <div className="removePContainer" style={{width: '20px', position: "relative"}}>
        <button 
          className="removePlay" 
          id={"removePlay" + i} 
          onClick={() => {
            setOpensnack(true);

            document.getElementById('removePlay' + i)!.style.display = 'none';

            setTimeout(() => { deletePlaylist({pID: playlist.playlist_id}) },300);            
          }}
        >
          Remove From Library
        </button>

        <img 
          src={dots} 
          className="removeImg" 
          onClick={() => {
            let plist = document.getElementById('removePlay' + i)!;

            if (plist.style.display === 'block') plist.style.display = 'none';

            else plist.style.display = 'block';
          }}
        />      
      </div>

      <a onClick={() => {        
        sessionStorage.setItem("uplist", "true");        

        navigate(`/app/playlist/${playlist.playlist_id}`)
      }}>
        <div style={{display: 'flex', alignItems: 'center', animation: 'fadeIn 0.5s'}}>
          {imageRender(playlist, 300, 300, 50)}        
          
          <h2>{playlist.name}</h2>
        </div>
              
        <br></br>      
      </a>      
    </div>
  );

  function listRecent() { 
    const recentlyPlayed = JSON.parse(localStorage.getItem("recent")!);

    const recents = Object.keys(recentlyPlayed).reduce<any>((acc, recent) => {
      acc.push({
        "id": recentlyPlayed[recent].id,
        "name": recentlyPlayed[recent].name,
        "artists": recentlyPlayed[recent].artists,
        "img": recentlyPlayed[recent].images.filter((t: any) => t.height == 640)[0],
      });

      return acc;
    }, []);        

    if (recentlyPlayed) {                    
      return (
        <div style={{display: 'flex'}} >
          {recents.map((recent: any, i: number) => 
            <div key={i} className="recents">        
              <a onClick={() => {
                const found = (albums?.find((e: any) => e?.album_id === recent.id) || (albums?.find((e: any) => e?.name === recent.name)));                                                                

                if (found && recent.id !== found?.album_id) {
                  recent.id = found?.album_id;
                }
                
                dispatch(setCurrentAlbum({
                  image:  recent.img.url,
                  artists: recent.artists.map((t: any) => t.name),
                  artist_ids: recent.artists.map((t: any) => t.uri.split(':').pop()),
                }));

                navigate(`/app/album/${recent.id}`);
              }}>
                <div style={{display: 'flex', flexDirection: 'column'}} >
                  {(!playerState.is_paused && sessionStorage.getItem('name') === recent.name) && <Loading3 />}

                  <img key={i} src={recent.img.url} style={{width: '150px', height: '190px', borderRadius: '10px'}}/> 
                </div>           
              </a>          
            </div>
          )}
        </div>
      );
    } else {
      return (
        <>
        </>
      );
    }
  };
  
  const localSearch = () => {
    return (
      <div className="filterHome" style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
          {/* Working on filter function */}
        <input 
          type='text' 
          className='filterTrack' 
          id='filterTrack' 
          placeholder='Looking for something?' 
          style={{borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px',width: '400px', height: '40px', backgroundColor: 'rgb(90, 210, 216)', color: 'black', fontWeight: 'bolder'}}  
          onChange={(e) => setFilter_val(e.target.value)} 
        />

        <button 
          style={{
            backgroundColor: '#7a19e9', color: 'rgb(90, 210, 216)', width: '60px', height: '44px', padding: '0px 5px', 
            borderTopRightRadius: '10px', borderBottomRightRadius: '10px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px'
          }} 
          onClick={() => {
            setFilter_val('');          

            (document.getElementById('filterTrack') as HTMLInputElement)!.value = '';
          }}
        >
          Clear
        </button>                                    
      </div>
    );
  };

  const buttonTabs = () => {
    return buttonNames.map((button: string, index: number) =>
      <button 
        key={index}
        style={{
          ...(activeButton === button ? {background: 'rgb(90, 210, 216)'} : {background: '#7a19e9'}),
          ...(button === "Albums" ? {borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'} : {})
        }} 
        className="homeButtons" 
        onClick={() => {
          setActiveButton(button);

          sessionStorage.setItem('activeHomeButton', Object.keys(sessionButtonMapping).find(key => sessionButtonMapping[key] === button) ?? 'album');
        }}
      >
        {button}
      </button>
    );
  };

  const customDropdown = () => {
    return (
      <CustomDropdown home={true} bold="900">
        <>
          {(!sessionStorage.getItem('home') || sessionStorage.getItem('home') === 'album') && albumSort(setSorted)}

          {sessionStorage.getItem('home') === 'playlist' && playlistSort(setPSorted)}
        </>
      </CustomDropdown>
    );
  };

  const addPlaylistButton = () => {
    return (
      <p 
        style={sessionStorage.getItem('home') === "playlist" ? {display: "inline"} : {display: "none"}} 
        className="addPlaylist" 
        onClick={() => {
          onOpenModal();                            
        }}
      >
        +
      </p>
    );
  };

  const addPlaylistModal = () => {
    return (
      <Modal modalId='modal4' open={open} onClose={onCloseModal} center closeIcon={closeIcon()}>
        <div style={{color: 'white', marginLeft: '35%',fontWeight: 'bolder',fontSize: '20px'}} >New Playlist</div>

        <form action=""  id="formPlaylist">
          <label htmlFor="first">
            Name:
          </label>

          <input type="text" id="first" name="first" placeholder="Enter your Playlist Name" required />
              
          <label htmlFor="second">
            Description:
          </label>

          <input type="text" id="second" name="second" placeholder="Optional"/>
          
          <div style={{color: 'white', fontWeight: 'bolder',fontSize: '20px'}} >Public</div>

          <div style={{display: 'flex', gap: '10px'}}>
            <div>
              <label htmlFor="option1">True</label>

              <input type="radio" id="option1" name="third" value="True" defaultChecked style={{width: '18px',height: '18px'}} />
            </div>  

            <div>
              <label htmlFor="option2">False</label>

              <input type="radio" id="option2" name="third" value="False" style={{width: '18px',height: '18px'}} />
            </div>  
          </div>                   

          <div className="wrap2">
            <button type="submit" onClick={(() => onCloseModal())}>
              Submit
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  const snackbar = () => {
    return (
      <MySnackbar state={opensnack} setstate={setOpensnack} message="Removed From Library"/>
    );
  };

  return (
    <>
      {!ready && !loading ? <Loading /> : (
        <>      
          <div className="homeContainer">
            {localSearch()}

            <div className="buttonContainer" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px'}}>    
              <div style={{display: 'flex'}}>
                {buttonTabs()}

                {customDropdown()}
              </div>                

              {addPlaylistButton()}

              {addPlaylistModal()}                                                                                                        
            </div>            
          </div>
            
          {pages[activeButton]?.()}            
        </>
      )}            

      {opensnack && snackbar()}
    </>
  );
};