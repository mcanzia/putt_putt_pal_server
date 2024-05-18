import { firebaseAdmin } from "../configs/firebase";
import { AuthorizationError } from "../util/error/CustomError";
export class AuthServiceImpl {

    static async validateAuthToken(bearer : any) {
        if (!bearer || !bearer.startsWith("Bearer ")) {
            throw new AuthorizationError("Error occurred while attempting to authorize user.");
        }
        const [_, roomToken] = bearer.trim().split(" ");
        if (!roomToken) {
            throw new AuthorizationError("Error occurred while attempting to authorize user.");
        }
        try {
            return roomToken;
        } catch (error) {
            throw new AuthorizationError("User is not authorized: " + error);
        }
    }
}