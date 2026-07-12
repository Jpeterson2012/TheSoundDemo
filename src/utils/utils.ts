import { resetInactivityTimer } from "./authTimerV2.ts";
import { store } from "../App/store.ts";

async function spotifyFetch(path: string, method?: string, options?: RequestInit) {
  const playing = store.getState().defaultState.playing;    

    if (path !== "/player" || playing) {        
        resetInactivityTimer();
    }    
    
    const BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
        ? import.meta.env.VITE_URL 
        : import.meta.env.VITE_PROD_URL;

    const urlTest = /^https?:\/\//.test(path);

    const url = urlTest ? path : `${BASE_URL}${path}`;        

    const response = await fetch(url, {
        method: method ?? 'GET',
        headers: {
            "Content-Type":"application/json",            
        },
        ...(!urlTest && {credentials: "include"}),
        ...options,                
    });

    if (!response.ok) {
        const text = await response.text();

        throw new Error(`Spotify error: ${response.status}: ${text}`);
    };

    return response;
};

export async function spotifyRequest<T = any>(path: string, method?: string, options?: RequestInit): Promise<T | null> {
    const response = await spotifyFetch(path, method, options);

    if (response.status === 204) return null;

    return (await response.json()) as T;
};

export async function spotifyStreamRequest(path: string, method?: string, options?: RequestInit): Promise<Response> {
  return spotifyFetch(path, method, options);
};

export const BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
    ? import.meta.env.VITE_URL 
    : import.meta.env.VITE_PROD_URL;

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);

  max = Math.floor(max);
  
  return (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString();
};

export function msToReadable(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  if (hours) {    
    return `${hours} ${hours === 1 ? "hr" : "hrs"} ${minutes ? minutes : ""} ${minutes ? (minutes === 1 ? "min" : "mins") : ""}`;
  }

  return `${minutes} min ${seconds ? seconds : ""} ${seconds ? (seconds === 1 ? "sec" : "secs") : ""}`;
};

export function timeCalc (ms: number) {
    const temp = Math.round(ms / 1000);

    let mins = Math.floor(temp / 60);

    let secs = temp - mins * 60;

    secs > 59 && (mins += 1, secs -= 60);

    (secs.toString().length === 1 && secs > 5) && (mins += 1, secs -= 6);

    if (secs.toString().length == 1) return `${mins}:${secs}0`;

    else return `${mins}:${secs}`;
};

export const stockImage = "https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg";