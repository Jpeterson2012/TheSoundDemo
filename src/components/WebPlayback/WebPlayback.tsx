//Session storage variable uplist, currentContext created here
//Fix current track session variable situation at some point
import './WebPlayback.css'
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer.ts';
import Home from '../../routes/Home';
import Album from '../../routes/Album.tsx';
import Playlist from '../../routes/Playlist.tsx';
import Artist from '../../routes/Artist.tsx';
import Logo from '../Logo/Logo.tsx';
import Discover from '../../routes/Discover.tsx';
import Categories from '../../routes/Categories.tsx';
import BottomBar from '../BottomBar/BottomBar.tsx';
import PollPlayer from '../PollPlayer.tsx';
import ButtonScroll from "../ButtonScroll/ButtonScroll.tsx";
import UsePlayerContext from '../../hooks/PlayerContext.tsx';

export default function WebPlayback() {  
  const [currentDev, setCurrentDev] = useState({name: "TheSound", id: sessionStorage.getItem("device_id"!)});         
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoading2, setIsLoading2] = useState(true);

  const navigate = useNavigate();                

  const player = usePlayer();    

  useEffect(() => {                
    if (!player.player) return;
       
    //localStorage.clear()        
    // document.addEventListener('beforeunload', () => {
    //     sessionStorage.clear()
    //     localStorage.clear()
    //     return ''
    // })           

    setIsLoading(false);

    sessionStorage.setItem("windowWidth", window.innerWidth.toString());
    sessionStorage.setItem("reload", "false");

    let pageAccessedByReload = (
      (window.performance.navigation && window.performance.navigation.type === 1) ||
      window.performance
      .getEntriesByType('navigation')
      .map((nav:any) => nav.type)
      .includes('reload')
    );

    pageAccessedByReload && sessionStorage.setItem("reload", "true");
    pageAccessedByReload && sessionStorage.getItem("reload") === "true" && (navigate("/app/"), sessionStorage.setItem("reload", "false"));
      
  }, [player]);    
    
  return (
    <>
      {!isLoading && (
        <>                              
          <UsePlayerContext.Provider value={{...player}}>
            {!isLoading2 && <Logo />}

            <Routes>                                              
              <Route path = '/' element={<Home setIsLoading2={setIsLoading2} />} key={0}/>
              <Route path='/discover' element={<Discover />} key={1} />
              <Route path='/categories/:id' element={<Categories />} key={2}/>
              <Route path='/album/:id' element={<Album />} key={3}/>
              <Route path='/playlist/:id' element={<Playlist />} key={4}/>
              <Route path='/artist/:id' element={<Artist />} key={5}/>
              <Route path='*' element={<Navigate to = "/" replace />} />                                           
            </Routes>    

            {!isLoading2 && <BottomBar currentDev={currentDev} setCurrentDev={setCurrentDev} />}
             
            <PollPlayer setCurrentDev={setCurrentDev} currentDev={currentDev}/>

            <ButtonScroll />
          </UsePlayerContext.Provider>                           
        </>
      )}        
    </>
  );
};