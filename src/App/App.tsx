import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ScrollToTop from '../components/ScrollToTop.tsx';
import ErrorPage from '../error-page.tsx'
import Login from '../routes/Login.tsx'
import WebPlayback from '../components/WebPlayback/WebPlayback.tsx'
import LoadingPage from '../routes/LoadingPage.tsx';

declare global {
  interface Window{
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
  }
};

export default function App() {         

    return (
        <Router>
            <ScrollToTop />
            <Routes>
              <Route path='/' element={<Login />} errorElement={<ErrorPage />} />              
              <Route path = '/loading' element={<LoadingPage />} />
              <Route path='/app/*' element={<WebPlayback />} />

              <Route path='*' element={<Navigate to = "/" replace />}/>
            </Routes>
      </Router>
    ) 
}
//<Routes>
//    <Route path='/' element={token ? <Navigate to = "/app" replace /> : <Login />} errorElement={<ErrorPage />} />
//    {/* <Route path = '/login' element={!token ? <Login /> : <Navigate to = "/app" replace />}/> */}
//    <Route path = '/loading' element={token && loading ? <Navigate to = "/app" replace /> : <Loading />} />
//    <Route path='/app/*' element={<WebPlayback />} />
//
//    <Route path='*' element={token ? <Navigate to = "/app" replace /> : <Navigate to = "/" replace /> }/>
//</Routes>