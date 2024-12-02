import express from "express";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, updatePaymentStatus } from "../controllers/orderController.js";  // Import the new controller method
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Order routes
orderRouter.post("/place", authMiddleware ,placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.post("/payment-status", updatePaymentStatus);  

export default orderRouter;
