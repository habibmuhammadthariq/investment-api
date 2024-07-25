import { ReadReportService } from "../services/read-report.service.js";
import { db } from "@src/database/database.js";
export const readReports = async (req, res, next) => {
    try {
        const readReportService = new ReadReportService(db);
        const iQuery = {
            fields: req.query.field ?? "",
            filter: req.query.filter ?? {},
            archived: req.query.archived ?? false,
            page: Number(req.query.page ?? 1),
            pageSize: Number(req.query.pageSize ?? 10),
            sort: req.query.sort ?? {},
        };
        const result = await readReportService.handle(iQuery);
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
