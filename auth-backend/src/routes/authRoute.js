import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword} from '../controllers/authController.js'

const authRoute = express.Router();


authRoute.post('/login', login);
authRoute.post('/logout', logout);
authRoute.post('/signup', signup);
authRoute.post('/verify-email', verifyEmail);
authRoute.post('/forgot-password', forgotPassword);
authRoute.post('/reset-password/:token', resetPassword);

export default authRoute;