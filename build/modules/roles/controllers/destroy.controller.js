import { DestroyRoleService } from "../services/destroy.service.js";
import { db } from "../../../database/database.js";
export const destroy = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const destroyRoleService = new DestroyRoleService(db);
        await destroyRoleService.handle(req.params.id, { session });
        await db.commitTransaction();
        res.status(204).json();
    }
    catch (error) {
        await db.abortTransaction();
        next(error);
    }
    finally {
        await db.endSession();
    }
};
