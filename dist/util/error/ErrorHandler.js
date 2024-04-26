"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const logger_1 = __importDefault(require("../logs/logger"));
class ErrorHandler {
    static handleError(error, response) {
        const { statusCode, message } = error;
        logger_1.default.error("Error Occurred: " + message);
        response.status(statusCode).json({
            status: "error",
            message
        });
    }
}
exports.ErrorHandler = ErrorHandler;
