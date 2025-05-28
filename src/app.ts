import express from 'express';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './routes/user';
import crimeCategoryRouter from './routes/crimeCategories';
import authRouter from './routes/auth';
import reportRouter from './routes/report';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/categories', crimeCategoryRouter);
app.use('/reports', reportRouter);

app.use(errors());

export default app;
