import { validate } from "../request/create.request.js";
import { CreateBankService } from "../services/create.service.js";
import { db } from "../../../database/database.js";
export const create = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const createBankService = new CreateBankService(db);
        const result = await createBankService.handle({
            ...req.body,
            createdBy_id: req.user?._id
        }, session);
        await db.commitTransaction();
        res.status(201).json({
            _id: result._id,
        });
    }
    catch (error) {
        await db.abortTransaction();
        next(error);
    }
    finally {
        await db.endSession();
    }
};
