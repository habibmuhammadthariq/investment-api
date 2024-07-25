import { ReadManyUserService } from "../services/read-many.service.js";
import { db } from "../../../database/database.js";
export const readMany = async (req, res, next) => {
    try {
        const readManyUserService = new ReadManyUserService(db);
        const query = {
            fields: req.query.fields ?? "",
            restrictedFields: ["password"],
            includes: req.query.includes ?? "",
            archived: req.query.archived ?? false,
            filter: req.query.filter ?? {},
            search: req.query.search ?? {},
            page: Number(req.query.page ?? 1),
            pageSize: Number(req.query.limit ?? 10),
            sort: req.query.sort ?? {},
        };
        let costumeFilter = {};
        if (query.archived) {
            costumeFilter = { archivedBy_id: { $exists: true } };
        }
        else {
            costumeFilter = { archivedBy_id: { $exists: false } };
        }
        query.filter = { ...query.filter, ...costumeFilter };
        const result = await readManyUserService.handle(query);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
