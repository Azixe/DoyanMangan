import express from "express"
//unfinished. need authentication
import { placeOrder } from "../controllers/orderController"

const orderRouter = express.Router()

orderRouter.post("/place",placeOrder);//authentication lom di implement