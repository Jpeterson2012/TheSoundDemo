import {createContext, useContext, ReactNode} from 'react';
import { useMediaQuery } from './useMediaQuery';

type ResponsiveContextType = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

const ResponsiveContext = createContext<ResponsiveContextType>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
});

export function ResponsiveProvider({children}: {children: ReactNode}) {
    const isMobile = useMediaQuery("(max-width: 500px)");
    const isTablet = useMediaQuery("(min-width: 501px) and (max-width: 1024px)");
    const isDesktop = useMediaQuery("(min-width: 1025px)");

    return (
    <ResponsiveContext.Provider value={{isMobile, isTablet, isDesktop}}>
        {children}
    </ResponsiveContext.Provider>
    );
};

export function useResponsive() {
    return useContext(ResponsiveContext);
};