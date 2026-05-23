import express from "express"
import upload from "../utils/multer.js";
import { singleUpload } from "../controllers/multerController.js"
import { multipleUpload } from "../controllers/multerController.js";
import { authmiddleware } from "../middleware/authMiddleware.js";

const route = express.Router()

route.post('/single-upload',upload.single("image"),authmiddleware,singleUpload)

route.post('/multiple-upload',upload.array("images",5),authmiddleware,multipleUpload)

export default route
