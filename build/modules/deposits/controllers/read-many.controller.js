import { db } from "../../../database/database.js";
import { ReadManyDepositService } from "../../../modules/deposits/services/read-many.service.js";
export const readMany = async (req, res, next) => {
    try {
        const readManyDepositService = new ReadManyDepositService(db);
        const iQuery = {
            fields: req.query.field ?? "",
            filter: req.query.filter ?? {},
            archived: req.query.archived ?? false,
            search: req.query.search ?? {},
            page: Number(req.query.page ?? 1),
            pageSize: Number(req.query.pageSize ?? 10),
            sort: req.query.sort ?? {},
        };
        const result = await readManyDepositService.handle(iQuery);
        const pagination = {
            page: result.pagination.page,
            pageSize: result.pagination.pageSize,
            pageCount: result.pagination.pageCount,
            totalDocument: result.pagination.totalDocument,
        };
        const response = {
            deposits: result.deposits,
            pagination: pagination,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
