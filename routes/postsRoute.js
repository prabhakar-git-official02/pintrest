import express from "express"
import { createPost, deletePost, deletePostField, getAllpost, getpost, updatePost } from "../controllers/postsController"
import { authmiddleware } from "../middleware/authMiddleware"

const route = express.Router()

route.post("/createPost",authmiddleware,createPost)

route.patch("/updatePost",authmiddleware,updatePost)

route.patch("/deletePostField",authmiddleware,deletePostField)

route.delete("/deletePost",authmiddleware,deletePost)

route.get("/getpost/:id",authmiddleware,getpost)

route.get('/getAllPosts',authmiddleware,getAllpost)

export default route