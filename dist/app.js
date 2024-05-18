"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_1 = __importDefault(require("./routes/index"));
const logger_1 = __importDefault(require("./util/logs/logger"));
const ErrorHandler_1 = require("./util/error/ErrorHandler");
const AuthService_1 = require("./services/AuthService");
var { unless } = require("express-unless");
const app = (0, express_1.default)();
const port = Number(process.env.VITE_PORT) || 7500;
// Security
app.use((0, cors_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200 // limit each IP to 100 requests per 15 minutes
});
app.use(limiter);
// Room Authorization
const authMiddleware = async (request, response, next) => {
    try {
        const roomId = await AuthService_1.AuthServiceImpl.validateAuthToken(request.headers.authorization);
        response.locals.roomId = roomId;
        next();
    }
    catch (error) {
        logger_1.default.error("Authorization attempt failed");
        return response.status(403).json({ error: 'User is not authorized to perform this action' });
    }
};
authMiddleware.unless = unless;
app.use(authMiddleware.unless({
    path: [
        { url: /^\/api\/room(\/|$)/, methods: ['GET', 'POST', 'PUT', 'DELETE'] }
    ]
}));
//Routes Definitions
app.use('/api', index_1.default);
//Error Handling
app.use((error, request, response, next) => {
    ErrorHandler_1.ErrorHandler.handleError(error, response);
});
app.listen(port, () => console.log(`Server running on port ${port}`));
