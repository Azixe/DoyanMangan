import express from "express"
//unfinished. need authentication
import { placeOrder } from "../controllers/orderController.js"

const orderRouter = express.Router()

orderRouter.post("/place",placeOrder);//authentication lom di implement

export default orderRouter;
