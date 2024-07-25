import { ObjectId } from "mongodb";
import { hasOne } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
import { fields } from "@src/database/mongodb-util.js";
export class ReadUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, filter) {
        const userRepository = new UserRepository(this.db);
        const aggregates = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
            { $limit: 1 },
        ];
        if (filter.includes) {
            const includes = filter.includes.split(";");
            let addField = {};
            for (const key of includes) {
                if (hasOne.hasOwnProperty(key)) {
                    const lookup = {
                        $lookup: hasOne[key],
                    };
                    aggregates.push(lookup);
                    addField = { ...addField, [key]: { $arrayElemAt: [`$${key}`, 0] } };
                }
            }
            if (addField) {
                aggregates.push({ $addFields: addField });
            }
        }
        if (filter && filter.fields) {
            aggregates.push({ $project: fields(filter.fields) });
        }
        if (filter && filter.restrictedFields) {
            aggregates.push({ $unset: filter.restrictedFields });
        }
        const aggregateResult = userRepository.aggregate(aggregates, { page: 1, pageSize: 10 });
        const result = (await aggregateResult);
        return result.data[0];
    }
}
