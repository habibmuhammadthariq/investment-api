import { ApiError } from "@point-hub/express-error-handler";
import { DepositRepository } from "../repositories/deposit.repository.js";
import { validate } from "../request/create.request.js";
import { db } from "../../../database/database.js";
import { CalculateDepositService } from "../../../modules/deposits/services/calculate.service.js";
import { CreateDepositService } from "../../../modules/deposits/services/create.service.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
export const create = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        if (req.body.formStatus === "complete")
            validate(req.body);
        const iQuery = {
            fields: "number",
            filter: { bilyetNumber: req.body.bilyetNumber },
            search: {},
            page: 1,
            pageSize: 1,
            sort: {},
        };
        const depositRepository = new DepositRepository(db);
        const deposits = await depositRepository.readMany(iQuery);
        if (deposits.data && deposits.data.length > 0) {
            throw new ApiError(400, { message: "Bilyet Number already exist" });
        }
        const calculate = new CalculateDepositService();
        const data = await calculate.calculate(req.body);
        const createDepositService = new CreateDepositService(db);
        const result = await createDepositService.handle({
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
