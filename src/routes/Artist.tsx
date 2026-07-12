import './Artist.css';
import { useState, useEffect, useContext } from "react";
import UsePlayerContext from '../hooks/PlayerContext.tsx';
import Track from "../components/Track/Track";
import Card from "../components/Card/Card";
import { Spin3 } from "../components/Spin/Spin.tsx";
import { spotifyRequest, spotifyStreamRequest, stockImage } from '../utils/utils.ts';
import { useResponsive } from '../hooks/ResponsiveContext.tsx';

export default function Artist() {
  const parts = window.location.href.split('/');
  const lastSegment = parts.pop() || parts.pop();  
  
  const [infoLoading, setInfoLoading] = useState(true);
  const [discogLoading, setDiscogLoading] = useState(true);
  const [artistInfo, setArtistInfo] = useState<any>([]);
  const [artistDiscog, setArtistDiscog] = useState<any>([]);

  const {playerState} = useContext(UsePlayerContext);

  const {isMobile} = useResponsive();

  //const projectTypes = {"appears_on": "Appears On", "album": "Albums", "single": "Singles", "compilation": "Compilations"}
  const projectTypes = {"album": "Albums", "single": "Singles", "compilation": "Compilations"};

  useEffect (() => {
    const fetchArtistInfo = async () => {
      try {        
        const data = await spotifyRequest(`/artists/${lastSegment}`);        

        setInfoLoading(false);

        setArtistInfo(data);        
      }
      catch (e) {
        console.error(e);
      }
    };
    
    fetchArtistInfo();      

    const fetchArtistDiscography = async () => {      
      const resp = await spotifyStreamRequest(`/artists2/${lastSegment}`);

      setDiscogLoading(false);

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
                    
          setArtistDiscog((prev: []) => [...prev, ...obj.music]);
        }
      }
    }

    fetchArtistDiscography();         
  }, [lastSegment]);

  const listTracks = () => {
    return artistInfo?.tracks.map((track: any, index: any) => {
      const trackIndex = (index + 1) < 10 ? '0' + (index + 1) : (index + 1);
      
      return (
        <div 
          key={index}
          style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: isMobile ? '0px' : '2vw'}} 
        >
          <p className="topTrackNum" style={{marginLeft: isMobile ? '0px' : '16px'}}>{trackIndex}</p> 

          <img 
            src={track.album?.images.find((t: any) => t.height == 64)?.url} 
            style={{
              marginLeft: isMobile ? '0px' : '20px', borderRadius: '10px', 
              ...(isMobile ? {height: '40px', width: '40px'} : {}),
            }} 
          />

          <Track 
            uri={track.album.uri}
            name={track.name}
            number={track.track_number}
            duration={track.duration_ms}
            album_name={track.album?.name}
            artist={track.artists}
            t_uri={track.uri}   
            customWidth={85}   
            paused={playerState.is_paused}
          />      
        </div>
      );      
    });
  };

  const displayWrap = (filterVal: string) => {
    const array = artistDiscog.filter((a: any) => a.album_group === filterVal);

    const chunkedArray = [];

    for (let i = 0; i < array.length; i += 10) {
      chunkedArray.push(array.slice(i, i + 10));
    }

    return chunkedArray.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((item: any, itemIndex: any) => (
          <div key={itemIndex} className="item">
            <div className="artistLists" key={itemIndex}>
              <h5>{item.release_date}</h5>

              <Card
                // key={a.id}
                id={item.id}
                uri={item.uri}
                image={item.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
                name={item.name}
                artist={item.artists.map((t: any) => t.name)}
                a_id={item.artists.map((t: any) => t.id)}
              />
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const artistFilter = (filterVal: string) => {
    return artistDiscog.filter((project: any) => project.album_group === filterVal).map((project: any, i: any) =>
      <div key={i}>
        <h5>{project.release_date}</h5>

        <Card
          // key={a.id}
          id={project.id}
          uri={project.uri}
          image={project.images.find((image: any) => image.height == 300)?.url}
          name={project.name}
          artist={project.artists.map((artist: any) => artist.name)}
          a_id={project.artists.map((artist: any) => artist.id)}
          paused={playerState.is_paused}
        />
      </div>
    )
  };

  const renderFilter = (projectTypes: any) => {
    return Object.keys(projectTypes).map((key: string, index: number) => 
      <div key={index}>
        {artistFilter(key)?.length && header(projectTypes[key])}

        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center'}}>
          {!isMobile ? artistFilter(key) : displayWrap(key)}
        </div>
      </div>
    );    
  };
  
  const artistName = () => {
    return (
      <h1>{artistInfo?.name}</h1>
    );
  };

  const artistImage = () => {
    const imageSrc = !artistInfo?.images.length ? stockImage : artistInfo?.images[0]?.url;

    return (
      <img 
        className="artistImage" 
        src={imageSrc} alt={artistInfo?.name}         
      />
    );
  };

  const followers = () => {
    return (
      <p style={{margin: '20px auto'}} >{artistInfo?.followers.total.toLocaleString()} followers</p>
    );
  };

  const genres = () => {
    const genreCount = artistInfo?.genres?.length ?? 0;

    const artistGenres = artistInfo?.genres?.join(", ");

    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <p className="headers2">Genre{genreCount > 1 ? "s" : ""}:&nbsp;</p>

        <p>{artistGenres ? artistGenres : "Music I guess. Idk"}</p>
      </div>
    );
  };

  const header = (title = "Top Tracks") => {
    return (
      <p className="headers">{title}</p>
    );
  };

  return (
    <div style={{width: '100%'}}>
      {infoLoading ? Spin3() :
        <div style={{marginBottom: '80px', display: 'flex', flexDirection: 'column'}}>
          {artistName()}
          
          {artistImage()}

          {followers()}

          {genres()}
            
          {header()}

          <div>
            {listTracks()}
          </div>

          { discogLoading ? Spin3() : renderFilter(projectTypes)}          
        </div>      
      }
    </div>
  )
};

//   const fetchArtist2 = async () => {
  //     try {
  //         var temp = await fetch(import.meta.env.VITE_URL + `/artists2/${lastSegment}`,{credentials: "include"})
  //       .then((res) => {
  //         // console.log(res.json())
  //         return res.json();
  //       }).then((data) => {return data})
  //         return temp
  //       }
  //       catch (err) {}
  // }
  // const assignArtists2 = async () => {
  //   // setLoading(true)
  //   const tempArtists2 = await fetchArtist2()    
  //   setLoading2(false)
  //   setArtists2(tempArtists2)

  // }
  // assignArtists2()