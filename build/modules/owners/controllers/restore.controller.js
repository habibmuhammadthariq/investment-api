import { RestoreOwnerService } from "../services/restore.service.js";
import { db } from "../../../database/database.js";
import { ReadOwnerService } from "../services/read.service.js";
export const restore = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const readOwnerService = new ReadOwnerService(db);
        (await readOwnerService.handle(req.params.id));
        const restoreOwnerService = new RestoreOwnerService(db);
        await restoreOwnerService.handle(req.params.id, session);
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
