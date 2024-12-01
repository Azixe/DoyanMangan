import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import nodemailer from 'nodemailer';
import crypto from 'crypto';

//Login user
const loginUser = async (req, res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//Register user
const registerUser = async (req, res) => {
    const { name, password ,email} = req.body;
    try {
        //checking user udh ada
        const exist = await userModel.findOne({email})
        if(exist) {
            return res.json({success:false,message:"User already exists"})
        }

        //validating email format & password kuat
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid email format"})
        }
        if(password.length < 8){
            return res.json({success:false,message:"Password must be at least 8 characters"})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,message:"User created successfully",token})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}

const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.resetToken = token;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
            pool: true,
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use TLS
            auth: {
                user: "thedragonswordminecraft@gmail.com", // Use your email
                pass: "wlmadaarleejbwfq", // App password (ensure this is correct)
            },
        });        

        const mailOptions = {
            from: "thedragonswordminecraft@gmail.com", // Sender email must match the auth user
            to: user.email, // Recipient
            subject: 'Password Reset',
            html: `<p>Click <a href="http://localhost:5173/update-password?token=${token}">here</a> to reset your password. This link is valid for one hour.</p>`,
        };        

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error sending reset email" });
    }
};

const updatePassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // Token must not be expired
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();
        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.json({ success: false, message: "Error updating password" });
    }
};


export{loginUser,registerUser, resetPassword, updatePassword}