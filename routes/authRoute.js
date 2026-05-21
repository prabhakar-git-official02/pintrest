import express from "express"
import { login, refreshToken, userCreate } from "../controllers/authController.js"

const route = express.Router()

route.post("/register",userCreate)

route.post("/login",login)

route.post("/refresh",refreshToken)

export default route