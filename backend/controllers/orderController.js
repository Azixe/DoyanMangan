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

        // Define delivery fee in IDR directly (previously USD)
        const DELIVERY_FEE_IDR = 15000; // IDR instead of USD

        // Prepare items for Midtrans and calculate total amount in IDR
        let totalAmountIDR = 0;
        const orderItems = Object.keys(cartData).map((itemId) => {
            const item = req.body.items.find((product) => product._id === itemId);

            // Ensure item is found
            if (!item) {
                console.error(`Item not found for itemId: ${itemId}`);
                return null; // Return null if item is not found
            }

            const quantity = cartData[itemId];
            totalAmountIDR += item.price * quantity; // Add item price in IDR

            return {
                id: itemId,
                price: item.price,
                quantity,
                name: item.name,
            };
        }).filter(item => item !== null); // Filter out undefined/null items

        if (orderItems.length === 0) {
            return res.json({ success: false, message: "No valid items in the cart" });
        }

        // Add delivery fee to total amount in IDR
        totalAmountIDR += DELIVERY_FEE_IDR;

        // Create a new order in your database (amount in IDR now)
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: orderItems,
            amount: totalAmountIDR, // Save total in IDR
            address: req.body.address,
        });

        await newOrder.save();

        // Prepare Midtrans transaction parameters (amount in IDR)
        const parameter = {
            transaction_details: {
                order_id: `${newOrder._id}-${Date.now()}`, // Unique order ID
                gross_amount: totalAmountIDR, // Total amount in IDR
            },
            customer_details: {
                first_name: req.body.address.firstName,
                last_name: req.body.address.lastName,
                email: req.body.address.email,
                phone: req.body.address.phone,
            },
            credit_card: {
                secure: true, // Enable 3DS
            },
        };

        // Create transaction with Midtrans
        const transaction = await snap.createTransaction(parameter);

        console.log("Transaction Token:", transaction.token); // Debugging purposes
        console.log("Transaction Redirect URL:", transaction.redirect_url); // Debugging purposes

        // Send the transaction redirect URL to the frontend
        res.json({
            success: true,
            snapToken: transaction.token, // Include Snap Token for modal
            session_url: transaction.redirect_url, // Include redirect URL for fallback
        });
    } catch (error) {
        console.error("Error in placeOrder:", error);
        res.json({ success: false, message: error.message });
    }
};

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
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
