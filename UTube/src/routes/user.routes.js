import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

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
    registerUser
)


export default userRouter