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
            html: `<!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            padding: 20px;
                            color: #333333;
                        }
                        .header {
                            text-align: center;
                            border-bottom: 1px solid #eeeeee;
                            padding-bottom: 10px;
                        }
                        .header h1 {
                            color: #32CD32; /* Lime green */
                        }
                        .content {
                            margin: 20px 0;
                            line-height: 1.6;
                        }
                        .cta {
                            text-align: center;
                            margin: 20px 0;
                        }
                        .cta a {
                            display: inline-block;
                            background-color: #32CD32; /* Lime green */
                            color: white;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                        .cta a:hover {
                            background-color: #28a428; /* Darker lime green for hover */
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 12px;
                            color: #888888;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Dear User,</p>
                            <p>We received a request to reset your password. If you made this request, please click the button below to reset your password:</p>
                        </div>
                        <div class="cta">
                            <a href="http://localhost:5173/update-password?token=${token}">Reset Your Password</a>
                        </div>
                        <div class="content">
                            <p>This link will expire in one hour. If you did not request this change, please ignore this email or contact our support team for assistance.</p>
                        </div>
                        <div class="footer">
                            <p>Thank you,<br><strong>The Support Team</strong></p>
                        </div>
                    </div>
                </body>
                </html>
                        `,
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