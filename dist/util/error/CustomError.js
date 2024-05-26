"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.DatabaseError = exports.AuthorizationError = exports.InternalServerError = exports.DuplicateNameError = exports.NotFoundError = void 0;
class CustomError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 400;
    }
}
exports.CustomError = CustomError;
class NotFoundError extends CustomError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class DuplicateNameError extends CustomError {
    constructor(message = 'Duplicate Player Name') {
        super(message, 303);
    }
}
exports.DuplicateNameError = DuplicateNameError;
class InternalServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class AuthorizationError extends CustomError {
    constructor(message) {
        super(message, 401);
    }
}
exports.AuthorizationError = AuthorizationError;
class DatabaseError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}
exports.DatabaseError = DatabaseError;
