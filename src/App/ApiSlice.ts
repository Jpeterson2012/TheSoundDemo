import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { createSelector } from '@reduxjs/toolkit'
// import { RootState } from './store'


interface Albums {
    album_type: string
    total_tracks: number
    album_id: string
    images: any[]
    name: string
    release_date: string
    uri: string
    artists: any[]
    tracks: {
        href: string
        items: []
        limit: number
        next: any
        offset: number
        previous: any
        total: number
    }
    copyrights: any[]
    label_name: string
}
interface Playlists {
    playlist_id: string
    images: []
    name: string
    public: boolean
    uri: string
    tracks: any[]
}
interface pTrack {
    images: []
    uri: string
    name: string
    track_number: number
    duration_ms: string
    artists: []
}
interface Liked {
    tracks: any[]
}
interface likedSong{
    album_id: string
    images: []
    artists: []
    duration_ms: string
    uri: string
    name: string    
}
interface User {
    items: string
}
interface Devices {
    id: string
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    type: string
    volume_percent: number
    supports_volume: boolean
}
interface Podcasts{
    items: []
}
interface Audiobooks{
    items: []
}
export type { Playlists, Albums, Devices }

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_URL }),
    keepUnusedDataFor: 60 * 60,
    endpoints: builder => ({
        getAlbums: builder.query<Albums[], void>({
            query: () => ({
                url: '/homepage2/albums',
                credentials: "include"
            })
        }),
        addAlbum: builder.mutation<Albums, Albums>({
            query: initalAlbum => ({
                url: '/update/album',
                method: 'POST',
                credentials: "include",
                body: initalAlbum
            }),
            async onQueryStarted(initialAlbum, lifecycleApi){
                const getAlbumPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getAlbums',undefined,draft => {
                        
                        draft?.unshift(initialAlbum)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    getAlbumPatchResult.undo()
                }
            }
        }),
        deleteAlbum: builder.mutation<Albums, {aID: string}>({
            query: ({aID}) => ({
                url: '/update/album',
                method: 'DELETE',
                credentials: "include",
                body: {aID}
            }),
            async onQueryStarted({aID}, lifecycleApi){
                const deleteAlbumPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getAlbums',undefined,draft => {
                        let temp = draft.findIndex(a => a.album_id === aID)
                        draft.splice(temp,1)
                    //    draft = draft.filter(a => a.album_id !== aID)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    deleteAlbumPatchResult.undo()
                }
            }
        }),
        getPlaylists: builder.query<Playlists[], void>({
            query: () => ({
                url: '/homepage2/playlists',
                credentials: "include",
            })
        }),
        getPlaylist: builder.query<Playlists, string>({
            query: playId => ({
                url: `/homepage2/playlists/${playId}`,
                credentials: "include",
            })
        }),
        addPTrack: builder.mutation<Playlists, {pID: any, initialP: pTrack}>({
            query: ({pID, initialP}) => ({
                url: `/update/playlist/${pID}`,
                method: 'POST',
                credentials: "include",
                body: initialP
            }),
            async onQueryStarted({pID, initialP}, lifecycleApi){
                const getPPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getPlaylists',undefined,draft => {
                        
                        const temp = draft.find(p => p.playlist_id === pID)
                        if (temp) temp.tracks.push(initialP)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    getPPatchResult.undo()
                }
            }
        }),
        deletePlaylist: builder.mutation<Playlists,{pID: any}>({
            query: ({pID}) => ({
                url: '/update/playlist',
                method: 'DELETE',
                credentials: "include",
                body: {pID}
            }),
            async onQueryStarted({pID}, lifecycleApi){
                const deletePlaylistPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getPlaylists',undefined,draft => {
                        let temp = draft.findIndex(a => a.playlist_id === pID)
                        draft.splice(temp,1)
                    //    draft = draft.filter(a => a.album_id !== aID)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    deletePlaylistPatchResult.undo()
                }
            }
        }),
        getLiked: builder.query<Liked, void>({
            query: () => ({
                url: '/homepage2/liked',
                credentials: "include",
            })
        }),
        addNewLiked: builder.mutation<Liked, likedSong>({
            query: initialSong => ({
                url: '/update/liked',
                method: 'POST',
                credentials: "include",
                body: initialSong
            }),
            async onQueryStarted(initialSong, lifecycleApi){
                const getLikedPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getLiked',undefined,draft => {
                        draft?.tracks?.unshift(initialSong)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    getLikedPatchResult.undo()
                }
            }
        }),
        deletePTrack: builder.mutation<Playlists, {pID: any, name: any}>({
            query: ({pID, name}) => ({
                url: `/update/playlist/${pID}`,
                method: 'DELETE',
                credentials: "include",
                body: {name}
            }),
            async onQueryStarted({pID, name}, lifecycleApi){
                const deletePTrackResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getPlaylists',undefined,draft => {
                        let temp = draft.find(p => p.playlist_id === pID)
                        if (temp) {
                            temp.tracks = temp.tracks.filter(a => a.name !== name)
                        } 
                    })
                )
                try{
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    deletePTrackResult.undo()
                }
            }
        }),
        deleteNewLiked: builder.mutation<Liked, {name: any}>({
            query: ({name}) => ({
                url: '/update/liked',
                method: 'DELETE',
                credentials: "include",
                body: {name}
            }),
            async onQueryStarted({name}, lifecycleApi){
                const deleteLikedPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getLiked',undefined,draft => {                                    
                        let temp = draft?.tracks?.filter((a:any) => a.name !== name)                        
                        draft.tracks = [...temp]
                        // draft?.tracks?.filter((a:any) => a.name !== deleteSong.name)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    deleteLikedPatchResult.undo()
                }
            }
        }),
        getUser: builder.query<User, void>({
            query: () => ({
                url: '/users',
                credentials: "include",
            })
        }),
        getDevices: builder.query<Devices[], void>({
            keepUnusedDataFor:  10,
            query: () => ({
                url: '/player/devices',
                credentials: "include",
            })
        }),
        getPodcasts: builder.query<Podcasts, void>({
            query: () => ({
                url: '/homepage2/podcasts',
                credentials: "include",
            })
        }),
        getAudiobooks: builder.query<Audiobooks, void>({
            query: () => ({
                url: '/homepage2/audiobooks',
                credentials: "include",
            })
        }),
    })
})

// type getPlaylistfromResultArg = TypedUseQueryStateResult<Playlists[],any,any>

// const selectOnePlaylist = createSelector(
//     (res: getPlaylistfromResultArg) => res.data,
//     (res: getPlaylistfromResultArg, userId: string) => userId,
//     (data, userId) => data?.filter(plist => plist.playlist_id === userId)
// )
// const emptyAlbums: Albums[] = []
// export const selectAlbumsResult = apiSlice.endpoints.getAlbums.select()
// export const selectAllAlbums = createSelector(
//     selectAlbumsResult,
//     albumsResult => albumsResult?.data ?? emptyAlbums
// )
// export const albumsAZ = createSelector(
//     selectAllAlbums,
//     (data) => data?.sort((a,b) => a.name.localeCompare(b.name))

// )
// export const selectAlbums = () => {
//     return albumsAZ(state)
// }


export const { 
    useGetAlbumsQuery, 
    useGetPlaylistsQuery,
    useGetPlaylistQuery, 
    useGetLikedQuery, 
    useGetUserQuery,
    useAddAlbumMutation,
    useDeleteAlbumMutation,
    useAddNewLikedMutation,
    useAddPTrackMutation, 
    useDeleteNewLikedMutation,
    useDeletePTrackMutation,
    useGetDevicesQuery,
    useGetPodcastsQuery,
    useGetAudiobooksQuery,
    useDeletePlaylistMutation,
} = apiSlice