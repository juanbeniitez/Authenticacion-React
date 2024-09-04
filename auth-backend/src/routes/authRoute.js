import express from 'express';
import { login, logout, signup } from '../controllers/authController.js'

const authRoute = express.Router();


authRoute.post('/login', login);
authRoute.post('/logout', logout);
authRoute.post('/signup', signup);

export default authRoute;