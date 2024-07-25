import { db } from "../../../database/database.js";
import { validate } from "../../../modules/deposits/request/create.request.js";
import { CalculateDepositService } from "../../../modules/deposits/services/calculate.service.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
import { UpdateDepositService } from "../../../modules/deposits/services/update.service.js";
export const update = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        if (req.body.formStatus === "complete")
            validate(req.body);
        const readDepositService = new ReadDepositService(db);
        const deposit = (await readDepositService.handle(req.params.id));
        const calculate = new CalculateDepositService();
        const data = await calculate.calculate(req.body, deposit);
        const updateDepositService = new UpdateDepositService(db);
        await updateDepositService.handle(req.params.id, {
            ...data,
            updatedBy: {
                _id: req.user?._id,
                name: req.user?.name,
                username: req.user?.username,
            },
        }, session);
        await db.commitTransaction();
        const readDeposit = new ReadDepositService(db);
        const result = (await readDeposit.handle(req.params.id));
        res.status(200).json({
            ...result,
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
