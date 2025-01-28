//Session storage vars ref_id and ref_items created here
import { useEffect,useState } from "react";
import './Album.css'
import { useGetAlbumsQuery } from "../App/ApiSlice.ts";
import UAlbum from "./UAlbum.tsx";
import RAlbum from "./RAlbum.tsx";
import { useParams } from "react-router-dom";

function render(found: any, UAlbum: any, RAlbum: any, SpinComponent: any, active: any, paused: any){
  //Check if album is already in library or not, also prevents rerenders when adding/removing to/from library
  if (found === undefined && sessionStorage.getItem("albumStatus") === "notuser"){
      return (<> <RAlbum SpinComponent={SpinComponent} active={active} paused={paused}/></>)
  }
  if (found !== undefined && sessionStorage.getItem("albumStatus") === "user"){
    return (<> <UAlbum SpinComponent={SpinComponent} active={active} paused={paused}/></>)
  }
  if (found !== undefined && sessionStorage.getItem("albumStatus") === "notuser"){
    return (<> <RAlbum SpinComponent={SpinComponent} active={active} paused={paused}/></>)
  }
  if (found === undefined && sessionStorage.getItem("albumStatus") === "user"){
    return (<> <UAlbum SpinComponent={SpinComponent} active={active} paused={paused}/></>)
  }
  
}

export default function Album({SpinComponent, active, paused}: any) {    
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    
    const {data: albums = []} = useGetAlbumsQuery()
    let found = albums?.find((e: any) => e?.album_id === lastSegment)

    let {id} = useParams()
    const [url, setUrl] = useState(id)
    

    useEffect (() => {
      setUrl(id)
      //This fixes render bug where fetch doesn't activate when clicking on currently playing album
    }, [sessionStorage.getItem("image"),id]);
    
    
    return (
      <>
        {render(found,UAlbum,RAlbum,SpinComponent,active,paused)}            
      </>
    )
}