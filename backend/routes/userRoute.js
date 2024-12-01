import express from "express"
import { loginUser,registerUser,resetPassword,updatePassword } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login",loginUser)
userRouter.post('/reset-password', resetPassword);
userRouter.post('/update-password', updatePassword);

export default userRouter;