import express from 'express';
import { login, logout, signup, verifyEmail } from '../controllers/authController.js'

const authRoute = express.Router();


authRoute.post('/login', login);
authRoute.post('/logout', logout);
authRoute.post('/signup', signup);
authRoute.post('/verify-email', verifyEmail);

export default authRoute;