import { ArchiveOwnerService } from "../services/archive.service.js";
import { db } from "../../../database/database.js";
import { ReadOwnerService } from "../services/read.service.js";
export const archive = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const readOwnerService = new ReadOwnerService(db);
        (await readOwnerService.handle(req.params.id));
        const archiveOwnerService = new ArchiveOwnerService(db);
        await archiveOwnerService.handle(req.params.id, { archivedBy_id: req.user?._id }, session);
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
