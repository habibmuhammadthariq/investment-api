import { ReadRoleService } from './../modules/roles/services/read.service.js';
import { ReadUserService } from './../modules/users/services/read.service.js';
import { secretKey } from "../config/auth.js";
import { ApiError } from '@point-hub/express-error-handler';
import { db } from "../database/database.js";
import { verifyToken } from "../utils/jwt.js";
async function auth(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization ?? "";
        if (authorizationHeader === "") {
            throw new ApiError(401);
        }
        const authorization = verifyToken(authorizationHeader.split(" ")[1], secretKey);
        const readUserService = new ReadUserService(db);
        const user = await readUserService.handle(authorization.sub, {
            restrictedFields: ["password"],
        });
        if (!user) {
            throw new ApiError(401);
        }
        const readRoleService = new ReadRoleService(db);
        const role = (await readRoleService.handle(user.role_id));
        if (role) {
            user.permissions = role.permissions;
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
}
export default auth;
