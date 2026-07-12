let timer: ReturnType<typeof setTimeout> | null = null;
let warningTimer: ReturnType<typeof setTimeout> | null = null;

const TIMEOUT = import.meta.env.VITE_TIMEOUT;

const STORAGE_KEY = "last-activity";

let listenersAttached = false;

let logoutCallback: () => void = () => {};
let warningCallback: () => void = () => {};

const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

function getRemainingTime() {
    const timeout = TIMEOUT * 60 * 1000;

    if (!isNaN(parseInt(TIMEOUT))) {
        const last = Number(localStorage.getItem(STORAGE_KEY));        

        if (!last) {
            return timeout;
        }

        const elapsed = Date.now() - last;

        return Math.max(timeout - elapsed, 0);
    }

    return timeout;
}

export function setLogoutCallback(cb: () => void) {
    logoutCallback = cb;
}

export function setWarningLogoutCallback(cb: () => void) {
    warningCallback = cb;
}

export function resetInactivityTimer() {
    if (!isNaN(parseInt(TIMEOUT))) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());

        if (timer) {
            clearTimeout(timer);
        }

        if (warningTimer) {
            clearTimeout(warningTimer);
        }

        const remaining = getRemainingTime();        
        const WARNING_TIME = 30 * 1000;

        if (remaining > WARNING_TIME) {
            warningTimer = setTimeout(() => {
                warningCallback();
            }, remaining - WARNING_TIME);
        }

        timer = setTimeout(() => {
            logoutCallback();
        }, remaining);
    }
}

export function initInactivityTimer() {
    if (!isNaN(parseInt(TIMEOUT))) {
        resetInactivityTimer();

        attachListeners();
    }
}

export function stopInactivityTimer() {
    if (timer) {
        clearTimeout(timer);

        timer = null;
    }

    if (warningTimer) {
        clearTimeout(warningTimer);

        warningTimer = null;
    }

    cleanupListeners();

    localStorage.removeItem(STORAGE_KEY);

    logoutCallback = () => {};

    warningCallback = () => {};
}

function attachListeners() {
    if (listenersAttached) {
        return;
    }

    events.forEach(event =>
        window.addEventListener(event, resetInactivityTimer),
    );

    listenersAttached = true;
}

function cleanupListeners() {
    if (!listenersAttached) {
        return;
    }

    events.forEach(event =>
        window.removeEventListener(event, resetInactivityTimer),
    );

    listenersAttached = false;
}