import { validate } from "../request/realised-interest.request.js";
import { db } from "../../../database/database.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
import { RealisedInterestService } from "../../../modules/deposits/services/realised-interest.service.js";
export const updateRealisedInterest = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const readDepositService = new ReadDepositService(db);
        (await readDepositService.handle(req.params.id));
        const realisedInterestService = new RealisedInterestService(db);
        await realisedInterestService.handle(req.params.id, {
            ...req.body,
            user: {
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
