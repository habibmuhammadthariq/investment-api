import { ReadRoleService } from "../services/read.service.js";
import { db } from "../../../database/database.js";
export const read = async (req, res, next) => {
    try {
        const readRoleService = new ReadRoleService(db);
        const result = (await readRoleService.handle(req.params.id));
        res.status(200).json({
            _id: result._id,
            name: result.name,
            permissions: result.permissions,
        });
    }
    catch (error) {
        next(error);
    }
};
