import {useEffect, useRef} from 'react';
import { store } from '../App/store.ts';
import { setAuthToken, setRefreshToken } from '../App/defaultSlice.ts';
import { spotifyRequest } from '../utils/utils';

export default function useAuth(){
    const timeoutRef = useRef<any>(null);        

    const tokenManager = async () => {
        try{                
            const data = await spotifyRequest("/token");                                                                                                       

            store.dispatch(setAuthToken(data.access_token));            
            
            store.dispatch(setRefreshToken(data.refresh_token));

            //scheduleRefresh(data.expires_in, data.refresh_token);
        }
        catch(e){
            console.error(`Error requesting access token: ${e}`);
            
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(tokenManager, 5000);
        }
    };

    const scheduleRefresh = (expires: any, refresh: any) => {
        clearTimeout(timeoutRef.current);

        const refreshTime = (expires - 60) * 1000;

        timeoutRef.current = setTimeout(() => refreshAccessToken(refresh), refreshTime);
    };

    const refreshAccessToken = async (refresh: any) => {        
        try{
            const data = await spotifyRequest("/token/refresh_token", "POST", {
                body: JSON.stringify({refresh_token: refresh})
            });

            store.dispatch(setAuthToken(data.access_token));     
                
            scheduleRefresh(data.expires_in, refresh);
        } catch (e) {
            console.error(`Error requesting access token: ${e}`);

            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => refreshAccessToken(refresh), 10000);
        }
    };

    useEffect(() => {              
        tokenManager();

        return () => clearTimeout(timeoutRef.current);
    }, []);    

    return;    
};