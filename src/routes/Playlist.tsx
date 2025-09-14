//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import './Playlist.css'
import RPlaylist from "./RPlaylist.tsx";
import UPlaylist from "./UPlaylist.tsx";
import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Playlist() {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  let {id} = useParams()  
  const [url, setUrl] = useState(id)
  
  useEffect(() => {
    setUrl(id)
  },[id])

  return (
    <>
      { sessionStorage.getItem("uplist") === "true" ? <UPlaylist lastSegment={lastSegment} /> : <RPlaylist lastSegment={lastSegment} /> }
    </>      
  )
}