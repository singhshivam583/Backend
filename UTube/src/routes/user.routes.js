import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRouter = Router()

userRouter.route("/register").post(
    // using multer middleware
    upload.fields([
        {
            name: "avatar", 
            maxCount: 1 ,
        },
        {
            name: "coverImage",
            maxcount: 1,
        }
    ]),
    registerUser,
)

userRouter.route("/login").post(loginUser)
// secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser)


export default userRouter