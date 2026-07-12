let timer: ReturnType<typeof setTimeout> | null = null;

const TIMEOUT = 15 * 60 * 1000;
//const TIMEOUT = 1 * 5 * 1000;

let logoutCallback: () => void = () => {};

export function setLogoutCallback(cb: () => void) {
    logoutCallback = cb;
};

export function resetInactivityTimer() {    
    if (timer) {
        clearTimeout(timer);
    }

    timer = setTimeout(() => {
        logoutCallback();
    }, TIMEOUT);
};