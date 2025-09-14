import {useState, useEffect} from 'react';

export default function useAuth(){
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState(0)

    useEffect(() => {                                            
        const fetchToken = async () => {
            try{
                const response = await fetch(import.meta.env.VITE_URL + "/token", {credentials: "include"})
                const data = await response.json()           

                setAccessToken(data.access_token)                
                setRefreshToken(data.refresh_token)                
                setExpiresIn(data.expires_in)                                         
                
                sessionStorage.setItem("token", data.access_token)    
            }
            catch(e){
                console.log(`Error requesting access token: ${e}`)
                window.location.href = '/'
            }                
        }

        fetchToken()
    }, []);

    useEffect(() => {              
        if (!refreshToken || !expiresIn) return        
        setInterval(() => {
            console.log('hi', refreshToken)
            try{
                fetch(import.meta.env.VITE_URL + "/token/refresh_token", {
                    method: 'POST',
                    headers: {"Content-Type":"application/json"},
                    credentials: "include", 
                    body: JSON.stringify({refresh_token: refreshToken})
                })
                .then(data => data.json())
                .then(item => {                    
                    sessionStorage.setItem("token", item.token), 
                    setAccessToken(item.token)                                                                            
                })
            }
            catch (e) {
                `Error requesting access token: ${e}`
            }              
        }, (expiresIn - 60) * 1000)

    }, [refreshToken, expiresIn]);    

    return accessToken;
}