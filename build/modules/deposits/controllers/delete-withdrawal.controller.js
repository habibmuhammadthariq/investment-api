import { db } from "../../../database/database.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
import { DeleteWithdrawalService } from "../../../modules/deposits/services/delete-withdrawal.service.js";
import { validate } from "../request/delete.request.js";
export const destroyWithdrawal = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const readDepositService = new ReadDepositService(db);
        (await readDepositService.handle(req.params.id));
        const deleteWithdrawalService = new DeleteWithdrawalService(db);
        await deleteWithdrawalService.handle(req.params.id, req.params.withdrawalId, {
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
