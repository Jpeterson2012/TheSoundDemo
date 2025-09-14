import './Artist.css'
import { useState, useEffect, useContext, useMemo } from "react";
import UsePlayerContext from '../contexts/PlayerContext.tsx';
import Track from "../components/Track/Track";
import Card from "../components/Card/Card";
import { Spin3 } from "../components/Spin/Spin.tsx";
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";
import { useParams } from "react-router-dom";

export default function Artist() {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  var {id} = useParams()
  
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [artists, setArtists] = useState<any>([])
  const [artists2, setArtists2] = useState<any>([])
  const [url,setUrl] = useState(id)

  const {playerState} = useContext(UsePlayerContext);

  const projectTypes = useMemo(() => {
    return  {"appears_on": "Appears On", "album": "Albums", "single": "Singles", "compilation": "Compilations"};
  },[]);

  useEffect (() => {
    setUrl(id)
    lastSegment! !== id ? setArtists2([]): null
    const fetchArtist = async () => {
      try {
        var temp = await fetch(import.meta.env.VITE_URL + `/artists/${lastSegment}`,{credentials: "include"})
          .then((res) => {
            // console.log(res.json())
            return res.json();
          }).then((data) => {return data})
        return temp
      }
      catch (err) {}
    }
    const assignArtists = async () => {      
      const tempArtists = await fetchArtist()
      setLoading(false)
      setArtists(tempArtists)      
    }
    assignArtists()    

    const fetchArtist2 = async () => {
      try {
        var temp = await fetch(import.meta.env.VITE_URL + `/artists2/${lastSegment}`,{credentials: "include"})
          .then((res) => {
          // console.log(res.json())
            return res.json();
          }).then((data) => {return data})
        return temp
      }
      catch (err) {}
  }
  const assignArtists2 = async () => {
    // setLoading(true)
    const tempArtists2 = await fetchArtist2()    
    setLoading2(false)
    console.log(tempArtists2)
    setArtists2(tempArtists2)

  }
  assignArtists2()

  }, [id]);
  
  const listTTracks = artists.tracks?.tracks.map((t: any, index:any) =>    
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',width: '100%'}} key={index}>
          
      <p className="topTrackNum" style={{marginLeft: '16px',overflow: 'visible'}}>{(index + 1) < 10 ? '0' + (index + 1) : (index + 1)}</p> 
      <img src={t.album?.images.filter((t: any) => t.height == 64).map((s: any) => s.url)} style={{marginLeft: '20px',borderRadius: '10px'}} />
      <Track 
        uri={t.album.uri}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={t.album?.name}
        artist={t.artists}
        t_uri={t.uri}   
        customWidth={80}   
        paused={playerState.is_paused}
      />      
    </div>
  )
  function displayWrap(filterVal: string){
    let array = artists2?.filter((a: any) => a.album_group === filterVal)

    const chunkedArray = [];
    for (let i = 0; i < array.length; i += 10) {
      chunkedArray.push(array.slice(i, i + 10));
    }
    return (
      <>
        {chunkedArray.map((row, rowIndex) => (
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
        ))}
      </>
    )
  }

  function artistFilter(filterVal: string){
    return artists2?.filter((a: any) => a.album_group === filterVal).map((a: any, i:any) =>
      <div key={i}>
        <h5>{a.release_date}</h5> 
        <Card
          // key={a.id}
          id={a.id}
          uri={a.uri}
          image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
          name={a.name}
          artist={a.artists.map((t: any) => t.name)}
          a_id={a.artists.map((t: any) => t.id)}
          paused={playerState.is_paused}
        />
      </div>
    )
  }

  function renderFilter(projectTypes: any){
    return (
      Object.keys(projectTypes).map((key: string, index: number) => 
        <div key={index}>
          {artistFilter(key)?.length && <p className="headers">{projectTypes[key]}</p>}

          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center'}}>
            {window.innerWidth > 500 ? artistFilter(key) : displayWrap(key)}
          </div>
        </div>
      )
    )
  }
  const artist = artists.artists

  return (
    <div style={{width: '95vw'}}>
      {loading ? Spin3() :
        <div style={{marginTop: '40px',marginBottom: '80px'}}>
          <h1>{artist?.name}</h1>
          
          <img className="artistImage" src={!artist?.images.length 
            ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' 
            : artist?.images[1]?.url} alt={artist?.name} style={{height: '320px', width: '320px',borderRadius: '10px'}} />

          <p style={{margin: '20px auto'}} >{artist?.followers.total.toLocaleString()} followers</p>

          <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <p className="headers2">Genre(s):</p>
            {artist?.genres.length ? artist?.genres.map((s: any, i: any) => <p key={i}>{s}</p>) : <p>Music I guess. Idk</p>}
          </div>
            
          <p className="headers">Top Tracks</p>

          <div>
            {listTTracks}
          </div>

          { loading2 ? Spin3() : renderFilter(projectTypes)}

          <ButtonScroll />
        </div>      
      }
    </div>
  )
}
