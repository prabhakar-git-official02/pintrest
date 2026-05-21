import dotenv from "dotenv";
dotenv.config()
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectdb } from "./lib/db.js";
import authRoute from "./routes/authRoute.js"
import userProfileRoute from "./routes/userProfileRoute.js"
import multerRoute from "./routes/multerRoute.js"
const app = express();

app.use(cors({
  origin : process.env.FROND_LOCAL_URL,
  credentials : true
}));

app.use(express.json());

app.use(cookieParser());

app.use("/auth",authRoute)

app.use("/profile",userProfileRoute)

app.use('/multer',multerRoute)

const serverConnect = async () => {
  try {
    await connectdb();

    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err.message);
  }
};

serverConnect();
