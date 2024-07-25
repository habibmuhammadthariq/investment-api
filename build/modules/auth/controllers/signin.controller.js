import { validate } from "../request/signin.request.js";
import { SigninUserService } from "../services/signin.service.js";
import { db } from "../../../database/database.js";
export const signin = async (req, res, next) => {
    try {
        validate(req.body);
        const signinUserService = new SigninUserService(db);
        const result = await signinUserService.handle(req.body.username, req.body.password);
        res.status(200).json({
            name: result.name,
            email: result.email,
            username: result.username,
            role: result.role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
};
