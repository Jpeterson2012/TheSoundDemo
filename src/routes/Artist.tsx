import { useState, useEffect } from "react";
import Track from "../components/Track/Track";
import Card from "../components/Card/Card";
import './Artist.css'
import { Spin2, Spin3 } from "../components/Spin/Spin.tsx";
import musicBar from "../components/musicBar/musicBar.tsx";
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";
import { useParams } from "react-router-dom";

export default function Artist({paused}: any) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  var {id} = useParams()
  
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [artists, setArtists] = useState<any>([])
  const [artists2, setArtists2] = useState<any>([])
  const [url,setUrl] = useState(id)
  useEffect (() => {
    setUrl(id)
    lastSegment! !== id ? setArtists2([]): null
    const fetchArtist = async () => {
        try {
            var temp = await fetch(import.meta.env.VITE_URL + `/artists/${lastSegment}`)
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

  //   const fetchArtist2 = async () => {
  //     try {
  //         var temp = await fetch(import.meta.env.VITE_URL + `/artists2/${lastSegment}`)
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



  const fetchArtist2 = async () => {
    const resp = await fetch(import.meta.env.VITE_URL + `/artists2/${lastSegment}`,{
      method: 'GET',
      headers: {"Content-Type":"application/json"},
    })
    setLoading2(false)
    let reader = resp.body!.getReader()
    let result
    let temp
    let a = []
    let decoder = new TextDecoder('utf8')
    while(!result?.done){
      result = await reader.read()
      if (!result?.done){
      let chunk = decoder.decode(result.value)
      // console.log(chunk ? JSON.parse(chunk) : {})
      // console.log('\n')
                   
      temp = JSON.parse(chunk).albums.items,
      a.push(...temp),  
      // a.push(...artists2),
      setArtists2([...a])
      }
    
    }
  }
    fetchArtist2()


    // console.log(artists2)



 
    
  }, [id]);
  var count: number = 1
  const listTTracks = artists.tracks?.tracks.map((t: any, i:any) =>

    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',width: '100%'}} key={i}>
      
    {!paused ? <span style={{position: 'absolute', left: '7.5vw'}}>{(sessionStorage.getItem('current') === t.uri || (t.artists?.name === t.name && t.artists?.artists[0].name === t.artist[0].name)) ? musicBar() : null}</span> : null}
    <p style={{marginLeft: '16px',overflow: 'visible'}}>{count < 10 ? '0' + count : count}</p> 
    <img src={t.album?.images.filter((t: any) => t.height == 64).map((s: any) => s.url)} style={{marginLeft: '20px'}} />
    <Track 
      uri={t.album.uri}
      name={t.name}
      number={t.track_number}
      duration={t.duration_ms}
      album_name={t.album?.name}
      artist={t.artists}
      t_uri={t.uri}   
      customWidth={80}   
    />
    <p hidden>{count++}</p>
    </div>
  )
  const listItems = artists2.filter((a: any) => a.album_group === 'album').map((a: any, i:any) =>
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
    />
    </div>
  )
  
  const listItems2 = artists2.filter((a: any) => a.album_group === 'single').map((a: any, i:any) =>
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
    />
    </div>
  )

  const listItems3 = artists2.filter((a: any) => a.album_group === 'compilation').map((a: any, i: any) =>
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
    />
    </div>
  )
  const listItems4 = artists2.filter((a: any) => a.album_group === 'appears_on').map((a: any, i:any) =>
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
    />
    </div>
  )
  

  return (
    <div style={{width: '95vw'}}>
    { loading ? Spin3() :
    <div style={{marginTop: '40px',marginBottom: '80px'}}>
      <h1>{artists.artists?.name}</h1>
        {/* <img src={artists.artists?.images.filter(t=>t.height == 320).map(s => s.url)} /> */}
        <img className="fade-in-image" src={artists.artists?.images.length == 0 ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' : artists.artists?.images[1]?.url} alt={artists.artists?.name} style={{height: '320px', width: '320px'}} />
        <p style={{margin: '20px auto'}} >{artists.artists?.followers.total.toLocaleString()} followers</p>
        <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <p className="headers">Genre(s):</p>
            {artists?.artists?.genres.length > 0 ? artists.artists?.genres.map((s: any, i: any) => <p key={i}>{s}</p>) : <p>Music I guess. Idk</p>}
        </div>
        
            <p className="headers">Top Tracks</p>
            <div>
            {listTTracks}
            </div>
            { loading2 ? Spin3() : (
              <>
            <div>
            {listItems4?.length !== 0 ? <p className="headers" >Appears On</p> : null}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '40px'}}>
                {listItems4}
            </div>
            </div>
            

            <div>
            {listItems?.length !== 0 ? <p className="headers" >Albums</p> : null}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '40px'}}>
                {listItems}
            </div>
            </div>
            

            <div >
            {listItems2?.length !== 0 ? <p className="headers" >Singles</p> : null}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center'}}>
                {listItems2}
            </div>
            </div>
            
            {listItems3?.length !== 0 ? <p className="headers">Compilations</p> : null}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '40px'}}>
                {listItems3}
            </div>
            </>
              )}
            
          
            <ButtonScroll />
    </div>
    
    }
    </div>
  )
}
