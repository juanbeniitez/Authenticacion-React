import { User } from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import generateVerificationToken from "../utils/generateVerificationToken.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import {sendVerificationEmail, sendWelcomeEmail} from "../config/emails.js"

const login = async (req, res) => {
    
}

const logout = async (req, res) => {
    
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
            use:{
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({succes: false, message: error.message});
    }
}

export {login, logout, signup, verifyEmail};