import { ReadUserService } from "../services/read.service.js";
import { db } from "../../../database/database.js";
export const read = async (req, res, next) => {
    try {
        const readUserService = new ReadUserService(db);
        const result = await readUserService.handle(req.params.id, {
            restrictedFields: ["password"],
            includes: req.query.includes ?? "",
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
