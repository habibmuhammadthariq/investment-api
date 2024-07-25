import { RestoreBankService } from "../services/restore.service.js";
import { db } from "../../../database/database.js";
import { ReadBankService } from "../services/read.service.js";
export const restore = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const readBankService = new ReadBankService(db);
        (await readBankService.handle(req.params.id));
        const restoreBankService = new RestoreBankService(db);
        await restoreBankService.handle(req.params.id, session);
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
