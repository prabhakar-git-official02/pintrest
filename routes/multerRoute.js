import upload from "../utils/multer.js";
import { uploadImage } from "../controllers/multerController.js";
import express from "express"

const route = express.Router()

route.post("/upload",upload.single("Image"),uploadImage)

export default route
