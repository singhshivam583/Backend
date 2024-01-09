import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary, deleteOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description){
        throw new apiError(400, "Please all the fields")
    }

    const videoFilePath =req.files?.videoFile[0]?.path;
    const thumbnailPath =req.files?.thumbnail[0]?.path;
    if(!videoFilePath || !thumbnailPath ){
        throw new apiError(400, "Video and thumbnail path is required")
    }

    const videoFile = await uploadOnCloudinary(videoFilePath);
    if(!videoFile){
        throw new apiError(400, "Video not uploaded")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath)
    if(!thumbnail){
        if(!thumbnail){
            throw new apiError(400, "Thumbnail not uploaded")
        }
    }

    const video = await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title,
        description,
    })
    if(!video){
        throw new apiError(500,"Server Error")
    }

    const createdVideo = await Video.findById(video._id)

   return res.status(201).json(
    new apiResponse(200, createdVideo, "Video Uploaded Successfully")
   )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)

    return res.status(201).json(new apiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = Video.findById(videoId);
    //TODO: update video details like title, description, thumbnail
    const {title, description} = req.body
    if(!title || !description){
        throw new apiError(400,"Please provide all the fields")
    }

    const thumbnailPath = req.files?.videoFile[0]?.path;
    if(!thumbnailPath ){
        throw new apiError(400, "thumbnail path is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if(!thumbnail){
        throw new apiError(400, "thumbnail not uploaded")
    }
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail: thumbnail.url,
            }
        }, {new:true}
    )
    if(!updatedVideo){
        throw new apiError(500, "Error while updating data in db")
    }

    const deleteOldThumbnail = await deleteOnCloudinary(video.thumbnail)
    if(!deleteOldThumbnail){
        throw new apiError(400, "Error while deleting old thumbnail file")
    }

    return res.status(201).json( new apiResponse(200, updatedVideo, "Video Updated Succesfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    let video = await Video.findById(videoId)

    const deleteOldThumbnail = await deleteOnCloudinary(video.thumbnail)
    if(!deleteOldThumbnail){
        throw new apiError(400, "Error while deleting old thumbnail file")
    }

    const deleteOldVideo = await deleteOnCloudinary(video.videoFile)
    if(!deleteOldVideo){
        throw new apiError(400, "Error while deleting old video file")
    }

    const deletedVideo = await Video.deleteOne({"_id": ObjectId(`${videoId}`)})
    if (!deletedVideo) {
        throw new apiError(500, 'Error while deleting data')
    }

    return res.status(201).json( new apiResponse(200, deletedVideo, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const toggle = await Video.findByIdAndUpdate(
        videoId,
        {
           $set:{
            isPublished: !isPublished
           }
        },
        {new: true} 
    )

    return res.status(201).json(new apiResponse(200, toggle, "Toggled Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
