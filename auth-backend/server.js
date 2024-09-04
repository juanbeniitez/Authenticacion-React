import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/mongodb.js';
import authRoute from './src/routes/authRoute.js';

dotenv.config();

const app = express();
connectDB();

// CORS
app.disable("x-powered-by")
app.use(cors());

app.use(express.json()); // Nos permite parsear las reqest como un json con req.body

//Routing
app.use('/api/auth', authRoute);

// Define port
const port = process.env.PORT || 4000;


const server = app.listen(port, (req, res) => {
    console.log("Listen in port http://localhost:4000");
})