import {useEffect} from 'react';
import { useNavigate } from "react-router-dom"
import Loading from '../components/Loading/Loading';
import { spotifyRequest } from '../utils/utils';
import {io} from "socket.io-client";

export default function LoadingPage() {
    const navigate = useNavigate();

    const URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
      ? import.meta.env.VITE_URL 
      : import.meta.env.VITE_PROD_URL;

    useEffect(() => {        
        const socket = io(URL.replace(/\/auth$/, ""), {
            withCredentials: true,
        });

        socket.on("connect", async () => {
            await spotifyRequest("/callback/import", "POST");
        });

        socket.on("loaded", () => {            
            navigate("/app", {replace: true});
        });

        socket.on("connect_error", (err) => {
            console.error("Socket error:", err.message);
        });

        return () => {
            socket.disconnect();
        };
    },[]);

    return <Loading />
};