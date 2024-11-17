import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData.cartData) {
            userData.cartData = {}; // Initialize cartData if undefined
        }

        let cartData = userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added to Cart", data: cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData.cartData) {
            userData.cartData = {}; // Initialize cartData if undefined
        }

        let cartData = userData.cartData;

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId]; // Remove item if quantity is 0
            }
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed from Cart", data: cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData.cartData) {
            userData.cartData = {}; // Initialize cartData if undefined
        }

        let cartData = userData.cartData;
        res.json({ success: true, data: cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
};

export { addToCart, removeFromCart, getCart };
