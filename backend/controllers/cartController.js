import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import mongoose from "mongoose";

// Helper function: Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add item to cart
const addToCart = async (req, res) => {
    try {
        // Validate userId and itemId
        const { userId, itemId } = req.body;
        if (!isValidObjectId(userId) || !isValidObjectId(itemId)) {
            return res.status(400).json({ success: false, message: "Invalid userId or itemId" });
        }

        // Find user and validate existence
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find item and validate existence
        const item = await foodModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Update user's cart atomically
        const updatedCart = { ...user.cartData };
        if (updatedCart[itemId]) {
            updatedCart[itemId] += 1; // Increment quantity if already in cart
        } else {
            updatedCart[itemId] = 1; // Add new item to cart
        }

        user.cartData = updatedCart;
        await user.save();

        res.status(200).json({ success: true, message: "Item added to cart", cartData: updatedCart });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Validate userId and itemId
        if (!isValidObjectId(userId) || !isValidObjectId(itemId)) {
            return res.status(400).json({ success: false, message: "Invalid userId or itemId" });
        }

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if item exists in the user's cart
        const cart = user.cartData || {};
        if (!cart[itemId]) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Update cart atomically
        cart[itemId] -= 1;
        if (cart[itemId] <= 0) {
            delete cart[itemId]; // Remove item when quantity reaches 0
        }

        user.cartData = cart;
        await user.save();

        res.status(200).json({ success: true, message: "Item removed from cart", cartData: cart });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get cart data for a user
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate userId
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return cart data
        const cart = user.cartData || {};
        res.status(200).json({ success: true, cartData: cart });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addToCart, removeFromCart, getCart };
