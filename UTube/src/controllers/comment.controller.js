import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const {page = 1, limit = 10} = req.query

    const allVideoComments = await Comment.find({video: videoId})
        .select('content')
        .limit(limit*1)
        .skip((page-1)*limit)
        .exec()
    if(!allVideoComments){
        throw new apiError(400, "No comments found")
    }

    return res.status(201).json(new apiResponse(200, allVideoComments, "all video comments fetched succesfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body;
    if(!content){
        throw new apiError(400, "please fill all the field")
    }

    const comment = await Comment.create({
        content,
        owner:req.user,
        video:videoId
    })

    const createdComment = await Comment.findById(comment._id)
    if(!createdComment){
        throw new apiError(500,"Server error while creating the comment")
    }

    return res.status(201).json(new apiResponse(200, createdComment, "Comment Created Successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    if(!content){
        throw new apiError(400,'Please provide the updated content')
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new apiError(404,'The comment does not exist')
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        comment._id,
        {
            $set:{
                content
            }
        },
        {new:true}
    )
    
    if (!updatedComment) {
        throw new apiError(404, 'The comment with given ID was not found!')
    }

    return res.status(201).json(new apiResponse(200, updatedComment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)
    console.log(comment)
    if(!comment){
        throw new apiError(404, "No comment with this id exists.")
    }

    const deletedComment = await Comment.deleteOne({"_id":comment._id})
    if(!deletedComment){
        throw new apiError(500,"Something went wrong while deleting the comment")
    }

    return res.status(201).json(new apiResponse(200, deletedComment, "comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}
