import express from "express"
import { createProfile, deleteProfileField, getProfile, updateProfile } from "../controllers/userProfileController.js"
import { authmiddleware } from "../middleware/authMiddleware.js"

const route = express.Router()

route.post("/createProfile",authmiddleware,createProfile)

route.patch("/updateProfile",authmiddleware,updateProfile)

route.patch("/deleteProfileField",authmiddleware,deleteProfileField)

route.get('/getProfile',authmiddleware,getProfile)

export default route