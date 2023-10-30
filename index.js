import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './router';
import errorMiddleware from './middlewares/error.middleware';

dotenv.config();

const { DB_URL, PORT, CLIENT_URL } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: CLIENT_URL,
   })
);
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
   try {
      await mongoose.connect(DB_URL);
      app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
   } catch (e) {
      console.log(e);
   }
};

start();
