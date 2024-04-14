import express, { Express, NextFunction, Request, Response } from 'express';
import { CustomError } from './CustomError';
import Logger from '../logs/logger';

export class ErrorHandler {
    
    static handleError(error : CustomError, response : Response) {
        const { statusCode, message } = error;
        Logger.error("Error Occurred: " + message);
        response.status(statusCode).json({
            status: "error",
            message
        });
    }
}