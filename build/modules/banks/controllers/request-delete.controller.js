import { UserRepository } from '../../../modules/auth/repositories/user.repository.js';
import { validate } from "../request/request-delete.request.js";
import { RequestDeleteBankService } from "../services/request-delete.service.js";
import { db } from "../../../database/database.js";
import { ReadBankService } from "../services/read.service.js";
export const requestDelete = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const readBankService = new ReadBankService(db);
        (await readBankService.handle(req.params.id));
        const userRepository = new UserRepository(db);
        (await userRepository.read(req.body.approvalTo));
        const requestDeleteBankService = new RequestDeleteBankService(db);
        await requestDeleteBankService.handle(req.params.id, req.body, session);
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
