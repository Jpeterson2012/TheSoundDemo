import './Album.css'
import { useEffect,useState } from "react";
import UAlbum from "./UAlbum.tsx";
import RAlbum from "./RAlbum.tsx";
import { useParams } from "react-router-dom";

function render(UAlbum: any, RAlbum: any){
  //Check if album is already in library or not, also prevents rerenders when adding/removing to/from library
  if (sessionStorage.getItem("albumStatus") === "notuser"){
    return <RAlbum />
  }
  else {
    return <UAlbum />
  }    
}

export default function Album() {
  let {id} = useParams()
  const [url, setUrl] = useState(id)
  
  useEffect (() => {
    setUrl(id)
    //This fixes render bug where fetch doesn't activate when clicking on currently playing album
  }, [sessionStorage.getItem("image"),id]);
    
  return (
    <>
      {render(UAlbum,RAlbum)}            
    </>
  )
}