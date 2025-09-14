import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [value, setValue] = useState(() => {
        //getting data from local storage
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue));
    });

    useEffect(() => {
        //setting data in local storage
        localStorage.setItem(key, JSON.stringify(initialValue));
    },[value, key]);

    return [value, setValue];    
};

export const windowSizes = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the event listener
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {windowWidth, windowHeight};
};