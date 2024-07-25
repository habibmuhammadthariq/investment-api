import { db } from "../../../database/database.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
export const read = async (req, res, next) => {
    try {
        const readDepositService = new ReadDepositService(db);
        const result = (await readDepositService.handle(req.params.id));
        res.status(200).json({ ...result });
    }
    catch (error) {
        next(error);
    }
};
