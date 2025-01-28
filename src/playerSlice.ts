import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./App/store";

interface track {
    name: "",
    album: {
        images: [
            { url: "" }
        ],
        uri: "",
        name: ""
    },
    artists: [
        { name: "" }
    ],
    uri: ""
}

export interface Player {
    player: any
    is_paused: any
    is_active: any
    current_track: track
    pos: any
    duration: any
}

const initialState: Player = {
    player: undefined,
    is_paused: false,
    is_active: false,
    current_track: {
        name: "",
        album: {
            images: [
                { url: "" }
            ],
            uri: "",
            name: ""
        },
        artists: [
            { name: "" }
        ],
        uri: ""
    },
    pos: 0,
    duration: 0
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playerUpdated(state, action: PayloadAction<Player>) {
            const { player, is_paused, is_active, current_track, pos, duration } = action.payload
            state.player = player
            state.is_paused = is_paused
            state.is_active = is_active
            state.current_track = current_track
            state.pos = pos
            state.duration = duration
        }
    }
})

export const { playerUpdated } = playerSlice.actions

export default playerSlice.reducer

export const selectDuration = (state: RootState) => state.player.duration