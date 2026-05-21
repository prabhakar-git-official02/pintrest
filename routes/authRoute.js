import express from "express"
import { forgotPassword, login, Logout, Me, refreshToken, resetPassword, userCreate } from "../controllers/authController.js"
import { authmiddleware } from "../middleware/authMiddleware.js"

const route = express.Router()

route.post("/register",userCreate)

route.post("/login",login)

route.post("/refresh",refreshToken)

route.post('/me',authmiddleware,Me)

route.post('/logout',Logout)

route.post('/forgotPassword',forgotPassword)

route.post('/resetPassword',resetPassword)

export default route