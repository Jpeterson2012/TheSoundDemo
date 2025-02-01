// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App/App.tsx'
import { store } from './App/store.ts'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ScrollToTop from './components/ScrollToTop.tsx';
import ErrorPage from './error-page.tsx'
import Login from './routes/Login.tsx'
import WebPlayback from './components/WebPlayback/WebPlayback.tsx'
import Loading from './components/Loading/Loading.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <Provider store={store} >
//     <App />
//     </Provider>
//   </StrictMode>,
// )

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <Router>
      <ScrollToTop />
            <Routes>
              <Route path='/' element={<App />} errorElement={<ErrorPage />} />
              <Route path = '/login' element={<Login />}/>
              <Route path = '/loading' element={<Loading />} />
              <Route path='/app/*' element={<WebPlayback />} />

              {/* <Route path='*' element={<WebPlayback /> }/> */}
            </Routes>
      </Router>
     </Provider>
  </>
)
