import { validate } from "../request/update.request.js";
import { UpdateBankService } from "../services/update.service.js";
import { db } from "../../../database/database.js";
import { ReadBankService } from "../services/read.service.js";
export const update = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const readBankService = new ReadBankService(db);
        (await readBankService.handle(req.params.id));
        const updateBankService = new UpdateBankService(db);
        await updateBankService.handle(req.params.id, { ...req.body, updatedBy_id: req.user?._id }, session);
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
