import { UpdateOwnerService } from "../services/update.service.js";
import { db } from "../../../database/database.js";
import { ReadOwnerService } from "../services/read.service.js";
export const update = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const readOwnerService = new ReadOwnerService(db);
        (await readOwnerService.handle(req.params.id));
        const updateOwnerService = new UpdateOwnerService(db);
        await updateOwnerService.handle(req.params.id, { ...req.body, updatedBy_id: req.user?._id }, session);
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
