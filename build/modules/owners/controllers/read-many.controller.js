import { ReadManyOwnerService } from "../services/read-many.service.js";
import { db } from "@src/database/database.js";
export const readMany = async (req, res, next) => {
    try {
        const readManyOwnerService = new ReadManyOwnerService(db);
        const iQuery = {
            fields: req.query.field ?? "name,createdBy_id,createdAt",
            filter: req.query.filter ?? {},
            archived: req.query.archived ?? false,
            search: req.query.search ?? {},
            page: Number(req.query.page ?? 1),
            pageSize: Number(req.query.pageSize ?? 10),
            sort: req.query.sort ?? {},
        };
        let costumeFilter = {};
        if (iQuery.archived) {
            costumeFilter = { archivedBy_id: { $exists: true } };
        }
        else {
            costumeFilter = { archivedBy_id: { $exists: false } };
        }
        iQuery.filter = { ...iQuery.filter, ...costumeFilter };
        const result = await readManyOwnerService.handle(iQuery);
        const pagination = {
            page: result.pagination.page,
            pageSize: result.pagination.pageSize,
            pageCount: result.pagination.pageCount,
            totalDocument: result.pagination.totalDocument,
        };
        const response = {
            owners: result.owners,
            pagination: pagination,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
