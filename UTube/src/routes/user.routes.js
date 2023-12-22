import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
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
// userRouter.post("/refresh-token").post(verifyJWT, refreshAccessToken)
userRouter.post("/refresh-token").post(refreshAccessToken)


export default userRouter