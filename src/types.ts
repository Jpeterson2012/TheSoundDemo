export type Track = {
    name: string,
    type: string,
    album: {
        images: [
            { url: string, height: number }
        ],
        uri: string,
        name: string
    },
    artists: [
        { name: string }
    ],
    uri: string
};

export type PlayerObject = {
    current_track: Track, is_paused: boolean, duration: number, pos: number
};


export type PlayerState = {
    player: null,
    playerState: PlayerObject,
    setPlayerState: ({}) => {},
    is_active: boolean
};
