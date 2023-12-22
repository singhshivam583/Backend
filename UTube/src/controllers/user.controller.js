import {asyncHandler} from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });
        return {accessToken, refreshToken}

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    // res.status(200).json({
    //     message: "OK",
    // })
    //  get user details from frontend
    //  validation not empty
    //  check user existance 
    //  check for images and avtar
    //  upload them to cloudinary , avatar check 
    //  create user object - create entry in db 
    //  remove password and refresh token field from response
    //  return response 

    const { fullName, email, username, password } = req.body
    // console.log("email: ", email);

    // if (fullName === "") {
    //     throw new apiError(400, "Full Name is required")
    // }

    if (
        [fullName, email, username, password].some((field) => field?.trim() ==="")
    ){
        throw new apiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    })

    if (existingUser) {
        throw new apiError(409, "User already exist")
    }
    // req.body ...... multer middle gives req.file 
    // console.log(req.files);
    
    const avatarLocalPath =req.files?.avatar[0]?.path;
    // console.log(avatarLocalPath);

    let coverImageLocalPath
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // console.log(coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file path is required")
    }
    // const avatarPath = '../../' + avatarLocalPath 
    // const coverPath = '../../' + coverImageLocalPath 

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    // console.log(avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // console.log(coverImage);

    if (!avatar) {
        throw new apiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
        throw new apiError(500, "Something went wrong while registering user")
   }

   return res.status(201).json(
    new apiResponse(200, createdUser, "User Registered Successfully")
   )
    
})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> date
    //  username or email
    // find the user 
    // password check
    // access and refresh token
    // send cookie

    const {email, username, password} = req.body

    if(!(username || email)){
        throw new apiError(400, "username or email is required")
    }

   const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new apiError(404, "user doesn't exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new apiError(401, 'Invalid Password')
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure:true,
    }
    console.log("user logged in successfully");

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options).json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure:true
    }
    console.log("user logged out successfully");

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new apiError(401, "unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
     const user = User.findById(decodedToken._id)
     if(!user){
         throw new apiError(401, "invalid refresh token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new apiError(401, "Refresh Token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
     return res.status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new apiResponse(200,
             {
                 accessToken,
                 refreshToken : newRefreshToken
             },
             "New Access Token Generated"
         )
     )
   } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
   }
    
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
} 
