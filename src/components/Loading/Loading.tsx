import './Loading.css'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Spin3 } from '../Spin/Spin'

export default function Loading () {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDone = async () => {
            try {
                var temp = await fetch(import.meta.env.VITE_URL + "/callback/emit")
            .then((res) => {
                return res.json();
            })
                return temp
            }
            catch (err) {}
            }
        const dataDone = async () => {
            await fetchDone()
            setIsLoading(false)
        }
        dataDone()
    },[])

    return (
        <>
            { isLoading ? 
            <div style={{display: 'flex', flexDirection: 'column',width: '95vw',height: '80vh'}}>                
                <div className="muzieknootjes">
                    <div className="noot-1">
                    &#9835; &#9833;
                    </div>
                    <div className="noot-2">
                    &#9833;
                    </div>
                    <div className="noot-3">
                    &#9839; &#9834;
                    </div>
                    <div className="noot-4">
                    &#9834;
                    </div>
                    <div className="noot-5">
                    &#9833; &#9835;
                    </div>
                    <div className="noot-6">
                    &#9835;
                    </div>
                    <div className="noot-7">
                    &#9834; &#9839;
                    </div>
                    <div className="noot-8">
                    &#9839;
                    </div>                                        
                </div>
                <div className='loadingSpin'>
                    {Spin3()}
                </div>                
            </div>  : <Navigate to={'/app'} />}
        </>
    )
}

// https://codepen.io/MaryG/pen/wJMMdw