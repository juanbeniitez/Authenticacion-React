import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/mongodb.js';
import cookieParser from 'cookie-parser';

import authRoute from './src/routes/authRoute.js';

dotenv.config();

const app = express();
connectDB();

// CORS
app.disable("x-powered-by")
app.use(cors({
    origin: (origin, callback) => {

        const ACCPTED_ORIGINS = [
            "http://localhost:8080",
            "http://localhost:5173",
            "https://movies.com",
        ]

        if(ACCPTED_ORIGINS.includes(origin)){
            return callback(null, true)
        }

        if(!origin){
            return callback(null, true)
        }

        return callback(new Error('Nor allowed by CORS'))
    }
}));

app.use(express.json()); // Nos permite parsear las reqest como un json con req.body
app.use(cookieParser()); // Nos permite

//Routing
app.use('/api/auth', authRoute);

// Define port
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.json({succes: true, message: "Ok"});
})


const server = app.listen(port, (req, res) => {
    console.log("Listen in port http://localhost:4000");
})