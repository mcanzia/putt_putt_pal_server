"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceImpl = void 0;
const CustomError_1 = require("../util/error/CustomError");
class AuthServiceImpl {
    static async validateAuthToken(bearer) {
        if (!bearer || !bearer.startsWith("Bearer ")) {
            throw new CustomError_1.AuthorizationError("Error occurred while attempting to authorize user.");
        }
        const [_, roomToken] = bearer.trim().split(" ");
        if (!roomToken) {
            throw new CustomError_1.AuthorizationError("Error occurred while attempting to authorize user.");
        }
        try {
            return roomToken;
        }
        catch (error) {
            throw new CustomError_1.AuthorizationError("User is not authorized: " + error);
        }
    }
}
exports.AuthServiceImpl = AuthServiceImpl;
