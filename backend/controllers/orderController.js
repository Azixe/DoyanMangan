import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
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
        //masih ada method yang belom di add seperti payment, belom setup api nya
 
    } catch (error) {
        
    }
}

// export {placeOrder}