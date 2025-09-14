import {createContext} from 'react';
import { track } from '../utils';

export const UsePlayerContext = createContext<any>({
    player: null,
    playerState: {current_track: track, is_paused: false, duration: 0, pos: 0},
    setPlayerState: ({}) => {return {}},
    is_active: false
});

export default UsePlayerContext