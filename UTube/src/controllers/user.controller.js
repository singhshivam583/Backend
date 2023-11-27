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

export {registerUser} 
