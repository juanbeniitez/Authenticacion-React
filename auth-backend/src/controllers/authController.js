import { User } from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import generateVerificationToken from "../utils/generateVerificationToken.js";

const login = async (req, res) => {
    
}

const logout = async (req, res) => {
    
}

const signup = async (req, res) => {
    const {email, password, name} = req.body;
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

        res.status(201).json({
            succes: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        
    }
}

export {login, logout, signup};