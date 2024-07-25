import { db } from "../../../database/database.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
import { validate } from "../request/delete.request.js";
import { DeleteInterestService } from "../../../modules/deposits/services/delete-interest.service.js";
export const destroyInterest = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const readDepositService = new ReadDepositService(db);
        (await readDepositService.handle(req.params.id));
        const deleteInterestService = new DeleteInterestService(db);
        await deleteInterestService.handle(req.params.id, {
            ...req.body,
            deletedBy: {
                _id: req.user?._id,
                name: req.user?.name,
                username: req.user?.username,
            },
        }, session);
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
