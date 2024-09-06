import { User } from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import generateVerificationToken from "../utils/generateVerificationToken.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import {sendForgotPasswordEmail, sendVerificationEmail, sendWelcomeEmail, sendResetSuccesEmail} from "../config/emails.js"

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({ succes: false,message: "Invalid credentials"});
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if(!isPasswordValid){
            res.status(400).json({
                succes: false,
                message: "Invalid credentials"
            });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            succes: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        console.log("Error in login function: " + error);
        res.status(400).json({
            succes: false,
            message: "Error server: " + error, 
        })
    }

    

    
}

const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        succes: true,
        message: "Logged out successfully",
    })
}

const signup = async (req, res) => {
    const {email, password, name} = req.body;
    console.log(email + password + name);
    try {
        if(!email || !password || ! name){
            throw new Error("All fields are required!");
        }

        const userAlreadyExists = await User.findOne({email});

        if(userAlreadyExists){
            return res.status(400).json(({succes: false, message: "User alredy exists"}));
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = generateVerificationToken();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24h
            
        })

        await user.save();

        //jwt 
        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            succes: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(400).json({succes: false, message: error.message});
    }
};

const verifyEmail = async (req, res) => { 
    const {code} = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if(!user){
            return res.status(400).json({succes: false, message: "Invalid or expired verification code"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.email);

        res.status(200).json({
            succes: true,
            message: "Email verified succesfully",
            user:{
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.log("Error occur: " + error);
        res.status(500).json({succes: false, message: "Server error"});
    }
}

const forgotPassword = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({ succes: false, message: "Invalid credentials: user not found"});
        }

        /// Generate reset token

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1hours

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiredAt = resetTokenExpiresAt;

        await user.save();
        await sendForgotPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ succes: true, message: "Forgot password email was sent succesfully"});

    } catch (error) {
        console.log("Error in forgot password: " + error);
        res.status(500).json({succes: false, message: "Server error"});
    }
}

const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiredAt: { $gt: Date.now() },
        });

        console.log(user)

        if(!user){
            res.status(400).json({ succes: false, message: "Invalid or expired reset token"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordExpiredAt = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        await sendResetSuccesEmail(user.email);

        res.status(200).json({ succes: true, message: "Password was reset succesfully"});

    } catch (error) {
        console.log('Error sending Succes reset password email: ' + error);
        throw new Error('Error sending Succes reset password email: ' + error);
    }
}

const checkAuth = async(req, res) => {
    try {
        const user = await User .findById(req.userId).select("-password");

        if(!user){
            return res.status(400).json({
                succes: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            succes: true,
            user
        });
    } catch (error) {
        console.log("Error in checkAuth: " + error);
        res.status(400).json({ succes: false, message: message.error});
    }
}

export {login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth};