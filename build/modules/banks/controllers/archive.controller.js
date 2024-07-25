import { ArchiveBankService } from "../services/archive.service.js";
import { db } from "../../../database/database.js";
import { ReadBankService } from "../services/read.service.js";
export const archive = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const readBankService = new ReadBankService(db);
        (await readBankService.handle(req.params.id));
        const archiveBankService = new ArchiveBankService(db);
        await archiveBankService.handle(req.params.id, { archivedBy_id: req.user?._id }, session);
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
