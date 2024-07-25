import { ApiError } from "@point-hub/express-error-handler";
import { secretKey } from "../../../config/auth.js";
import { ReadUserService } from "../../../modules/users/services/read.service.js";
import { verifyToken } from "../../../utils/jwt.js";
export class VerifyTokenUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(token) {
        const result = verifyToken(token.split(" ")[1], secretKey);
        // token invalid
        if (!result) {
            throw new ApiError(401);
        }
        // token expired
        if (new Date() > result.exp) {
            throw new ApiError(401);
        }
        const readUserService = new ReadUserService(this.db);
        const user = (await readUserService.handle(result.sub, {
            restrictedFields: ["password"],
        }));
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            googleDriveId: user.googleDriveId,
            oauth: user.oauth,
        };
    }
}
