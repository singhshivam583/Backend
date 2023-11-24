import  express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()

// .use is used for middle ware or for configrations
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static("public"));
app.use(cookieParser())


// routes import
import userRouter from "./routes/user.routes.js";

// routes declarations
app.use("/api/v1/users", userRouter);

// http://localhost:8000/api/v1/users/< register or login or logout ...>


// error handling

export {app};