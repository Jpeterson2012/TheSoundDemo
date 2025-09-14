import './Login.css'
import logo from '../images/logo.png'
import Loading2 from '../components/Loading2/Loading2.tsx'

export default function Login() {             
  return (
    <>
      <Loading2 />

      <div className='loginImage' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img className='introImg' src={logo} alt='Avatar' />
        <h1 className="intro">TheSound<sup>TM</sup></h1>
      </div>

      <button className="home"onClick={() => {
        location.href = import.meta.env.VITE_URL + '/login'
        sessionStorage.setItem("loggedIn", "true")
      }}>Login
      </button>      
    </>
  )
}


