import { ObjectId } from "mongodb";
import { UserRepository } from "../repositories/user.repository.js";
import { fields } from "../../../database/mongodb-util.js";
export class ReadUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, filter = {
        fields: "",
        filter: {},
        restrictedFields: [],
        page: 1,
        pageSize: 1,
        sort: {},
    }) {
        const userRepository = new UserRepository(this.db);
        const aggregates = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "role",
                },
            },
            {
                $set: {
                    role: {
                        $arrayElemAt: ["$role", 0],
                    },
                },
            },
            { $limit: 1 },
        ];
        if (filter && filter.fields) {
            aggregates.push({ $project: fields(filter.fields) });
        }
        const aggregateResult = userRepository.aggregate(aggregates, filter);
        const result = (await aggregateResult);
        return result.data[0];
    }
}
