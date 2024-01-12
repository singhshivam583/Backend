import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content }= req.body
    // const owner = req.user
    // console.log(content)

    if(!content){
        throw new apiError(400, "content can't be empty")
    }

    const tweet = await Tweet.create({
        content:content,
        owner:req.user,
    })

    const createdTweet = await Tweet.findById(tweet._id)
    if(!createdTweet){
        throw new apiError(400,"tweet not created")
    }

    return res.status(201).json(new apiResponse(200, createdTweet, "Tweet Created Succesfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    const userTweets = await Tweet.find({"owner":userId}).select("content")
    if(!userTweets){
        throw new apiError(404,"No Tweets Found for this User")
    }
    return res.status(201).json(new apiResponse(200, userTweets, "All the tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new apiError(400, 'The tweet with given ID was not found')
    }
    const { content } = req.body;
    if(!content){
        throw new apiError(400,'Content is missing to update a tweet');
    }
    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
            }
        },
        { new: true}
    )

    return res.status(201).json(new apiResponse(200, updateTweet, "Tweet updated succesfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new apiError(400, 'The tweet with given ID does not exist')
    }
    
    const deletedTweet = await Tweet.deleteOne({"_id": tweet._id})
    if (!deletedTweet) {
        throw new apiError(500, 'Error while deleting data')
    }
    // await video.remove()

    return res.status(201).json( new apiResponse(200, deletedTweet, "Video deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
