import {asyncHandler} from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';


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
    console.log("email: ", email);

    // if (fullName === "") {
    //     throw new apiError(400, "Full Name is required")
    // }

    if (
        [fullName, email, username, password].some((field) => filed?.trim() ==="")
    ){
        throw new apiError(400, "All fields are required")
    }

    const existingUser = User.findOne({
        $or: [{email}, {username}]
    })

    if (existingUser) {
        throw new apiError(409, "User already exist")
    }
    // req.body ...... multer middle gives req.file 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

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

export {registerUser} 
