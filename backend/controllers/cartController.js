import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {}; // Ensure cartData exists

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1; // Add new item with quantity 1
        } else {
            cartData[req.body.itemId] += 1; // Increment quantity
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added to Cart", cartData });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.json({ success: false, message: "Error adding to cart" });
    }
}



// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId]) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] <= 0) {
                delete cartData[req.body.itemId]; // Remove item if quantity is zero
            }
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed from Cart", cartData });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.json({ success: false, message: "Error removing from cart" });
    }
}

// fetch user cart data  
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.json({ success: false, message: "Error retrieving cart data" });
    }
}

export {addToCart, removeFromCart, getCart}