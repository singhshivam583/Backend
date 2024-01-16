import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name || !description){
        throw new apiError(400,"Fill all the fields")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user
    });

    const createdPlaylist = await Playlist.findById(playlist._id);
    if(!createdPlaylist){
        throw new apiError(400, "Something went wrong creating playlist")
    }

    return res.status(201).json(
        new apiResponse(200, createdPlaylist, "Playlist Created Successfully")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const userPlaylists = await Playlist.find({owner: userId})
    if(!userPlaylists){
        throw new apiError(400, "No playlists found for this user")
    }

    return  res.status(201).json(new apiResponse(200, userPlaylists, "all user's playlist fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new apiError(400, "Playlist not found")
    }

    return res.status(201).json(new apiResponse(200, playlist, "playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new apiError(400,"Playlist does not exist.")
    }

    const video = Video.findById(videoId)
    if(!video){
        throw new apiError(400, "Video does not exists.")
    }

    const addVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{
                videos : videoId
            }
        },
        {new: true}
    )
    return res.status(201).json(new apiResponse(201, addVideo, "Video Added Successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const removedVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos : {
                    _id : videoId
                }
            }
        },
        {new:true}
    )
    // console.log("removeVideo", removeVideo);

    return res.status(201).json(new apiResponse(200, removedVideo, "Video removed successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    if(!deletePlaylist){
        throw new apiError(400, "error while deleting playlist")
    }

    return res.status(200).json(new apiResponse(200, deletedPlaylist, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    let updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        {new: true}
    )
    if(!updatePlaylist.success){
        throw new apiError(200,"playlist doesn't updated")
    }

    return res.status(201).json(new apiResponse(200, updatePlaylist, "Playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

