import { ReadBankService } from "../services/read.service.js";
import { db } from "../../../database/database.js";
export const read = async (req, res, next) => {
    try {
        const readBankService = new ReadBankService(db);
        const result = (await readBankService.handle(req.params.id));
        res.status(200).json({
            _id: result._id,
            name: result.name,
            createdBy_id: result.createdBy_id,
            createdAt: result.createdAt,
        });
    }
    catch (error) {
        next(error);
    }
};
