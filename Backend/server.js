import express from 'express';
import cors from 'cors';
import { connectdb } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
// App config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectdb();

// API End Point
app.use("/api/food", foodRouter);
app.use('/images',express.static('uploads'));
app.use("/api/user", userRouter)
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
