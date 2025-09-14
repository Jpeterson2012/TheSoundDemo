// import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { store } from './App/store.ts'
import { Provider } from 'react-redux'
import App from './App/App.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>  
)
