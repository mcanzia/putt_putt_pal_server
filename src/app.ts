import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { app, httpServer } from './socket';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes/index';
import Logger from './util/logs/logger';
import { CustomError } from './util/error/CustomError';
import { ErrorHandler } from './util/error/ErrorHandler';
import { AuthServiceImpl } from './services/AuthService';

var { unless } = require("express-unless");

const port: number = Number(process.env.VITE_PORT) || 7500;

// Compression
app.use(compression());

// Security
app.use(cors());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

// Room Authorization
const authMiddleware = async (request : Request, response : Response, next : NextFunction) => {
  try {
    const roomId = await AuthServiceImpl.validateAuthToken(request.headers.authorization)
    response.locals.roomId = roomId;
    next();
  } catch(error) {
    Logger.error("Authorization attempt failed");
    return response.status(403).json({ error: 'User is not authorized to perform this action' });
  }
};

authMiddleware.unless = unless;

app.use(
  authMiddleware.unless({
  path: [
    { url: /^\/api\/room(\/|$)/, methods: ['GET', 'POST', 'PUT', 'DELETE'] }
  ]
}));


//Routes Definitions
app.use('/api', routes);

//Error Handling
app.use((error : CustomError, request : Request, response : Response, next : NextFunction) => {
  ErrorHandler.handleError(error, response);
});

httpServer.listen(port, () => console.log(`Server running on port ${port}`));