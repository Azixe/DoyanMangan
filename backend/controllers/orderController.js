import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
    isProduction: false, // Sandbox environment
    serverKey: "SB-Mid-server-Ugm0EYBJ0swMLaLuMX2uJeNY",
});

const placeOrder = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        const cartData = userData.cartData;

        if (!cartData || Object.keys(cartData).length === 0) {
            return res.json({ success: false, message: "Cart is empty" });
        }

        // Prepare items for Midtrans
        const orderItems = Object.keys(cartData).map((itemId) => {
            const item = req.body.items.find((product) => product._id === itemId);
            return {
                ...item,
                quantity: cartData[itemId],
            };
        });

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: orderItems,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();

        const parameter = {
            transaction_details: {
                order_id: `${newOrder._id}-${Date.now()}`,
                gross_amount: req.body.amount * 1000 * 5,
            },
            customer_details: {
                first_name: req.body.address.firstName,
                last_name: req.body.address.lastName,
                email: req.body.address.email,
                phone: req.body.address.phone,
            },
        };

        const transaction = await snap.createTransaction(parameter);
        console.log("Transaction Response:", transaction);

        res.json({
            success: true,
            snapToken: transaction.token, // Include Snap Token for modal
            session_url: transaction.redirect_url, // Include redirect URL for fallback
        });
    } catch (error) {
        console.error("Error in placeOrder:", error);
        res.json({ success: false, message: error.message });
    }
}




const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            // Mark the order as paid
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            // Clear the user's cart
            const order = await orderModel.findById(orderId);
            await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

            res.json({ success: true, message: "Payment confirmed. Cart cleared." });
        } else {
            // Payment failed, delete the order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment not completed. Order canceled." });
        }
    } catch (error) {
        console.error("Error in verifyOrder:", error);
        res.json({ success: false, message: error.message });
    }
}


//user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

//listing order buat admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API buat update order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}