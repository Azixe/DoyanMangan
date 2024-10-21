import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import Stripe from "stripe";

//menempatkan order untuk frontend
export const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userID,{cartData:{}})
    } catch (error) {
        
    }
}

export {placeOrder}