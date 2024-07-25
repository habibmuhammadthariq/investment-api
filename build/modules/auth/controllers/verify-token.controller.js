import { ApiError } from "@point-hub/express-error-handler";
import { VerifyTokenUserService } from "../services/verify-token.service.js";
import { db } from "../../../database/database.js";
export const verifyToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization ?? "";
        if (authorizationHeader === "") {
            throw new ApiError(401);
        }
        const verifyTokenUserService = new VerifyTokenUserService(db);
        const result = await verifyTokenUserService.handle(authorizationHeader);
        res.status(200).json({
            _id: result._id,
            name: result.name,
            email: result.email,
            username: result.username,
            role: result.role,
        });
    }
    catch (error) {
        next(error);
    }
};
