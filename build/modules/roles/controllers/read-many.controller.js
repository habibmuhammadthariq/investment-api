import { ReadManyRoleService } from "../services/read-many.service.js";
import { db } from "@src/database/database.js";
export const readMany = async (req, res, next) => {
    try {
        const readManyRoleService = new ReadManyRoleService(db);
        const iQuery = {
            fields: req.query.field ?? "",
            filter: req.query.filter ?? {},
            search: req.query.search ?? {},
            page: Number(req.query.page ?? 1),
            pageSize: Number(req.query.pageSize ?? 10),
            sort: req.query.sort ?? {},
        };
        const result = await readManyRoleService.handle(iQuery);
        const pagination = {
            page: result.pagination.page,
            pageSize: result.pagination.pageSize,
            pageCount: result.pagination.pageCount,
            totalDocument: result.pagination.totalDocument,
        };
        const response = {
            roles: result.roles,
            pagination: pagination,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
