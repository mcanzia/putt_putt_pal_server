import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import https from 'https';
import rateLimit from 'express-rate-limit';
import routes from './routes/index';
import Logger from './util/logs/logger';
import { CustomError } from './util/error/CustomError';
import { ErrorHandler } from './util/error/ErrorHandler';

const app: Express = express();
const port: number = Number(process.env.VITE_PORT) || 7500;

// Security
app.use(cors());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

//Routes Definitions
app.use('/api', routes);

//Error Handling
app.use((error : CustomError, request : Request, response : Response, next : NextFunction) => {
  ErrorHandler.handleError(error, response);
});

app.listen(port, () => console.log(`Server running on port ${port}`));