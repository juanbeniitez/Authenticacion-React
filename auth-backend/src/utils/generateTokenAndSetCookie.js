import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign( { userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie("token", token, {
        httpOnly: true, //xxs
        secure: process.env.NODE_ENV === "production",
        simeSite: "strict", //csrf
        maxAge: 7*24*60*1000,
    });

    return token;
}

export default generateTokenAndSetCookie;