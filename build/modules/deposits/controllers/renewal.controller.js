import { validate } from "../request/renewal.request.js";
import { db } from "../../../database/database.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
import { CalculateDepositService } from "../../../modules/deposits/services/calculate.service.js";
import { RenewalService } from "../../../modules/deposits/services/renewal.service.js";
export const renewal = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const readDepositService = new ReadDepositService(db);
        (await readDepositService.handle(req.params.id));
        const calculate = new CalculateDepositService();
        const data = await calculate.calculate(req.body);
        const renewalService = new RenewalService(db);
        const result = await renewalService.handle(req.params.id, {
            ...data,
            createdBy: {
                _id: req.user?._id,
                name: req.user?.name,
                username: req.user?.username,
            },
        }, session);
        await db.commitTransaction();
        const readDeposit = new ReadDepositService(db);
        const deposit = (await readDeposit.handle(result._id));
        res.status(201).json({
            ...deposit,
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
