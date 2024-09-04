import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth} from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';

const authRoute = express.Router();

authRoute.get('/check-auth', verifyToken, checkAuth);

authRoute.post('/login', login);
authRoute.post('/logout', logout);
authRoute.post('/signup', signup);
authRoute.post('/verify-email', verifyEmail);
authRoute.post('/forgot-password', forgotPassword);
authRoute.post('/reset-password/:token', resetPassword);

export default authRoute;