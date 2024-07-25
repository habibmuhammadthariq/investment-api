import { db } from "../../../database/database.js";
import { UserRepository } from "../../../modules/auth/repositories/user.repository.js";
const userRepository = new UserRepository(db);
const result = await userRepository.readMany({
    fields: "",
    filter: {},
    page: 1,
    pageSize: 1,
    sort: {},
});
const users = result.data;
export const banksSeed = [
    {
        name: "PT ABC",
        branch: "Jakarta",
        address: "Jl Jakarta",
        phone: "08123123122",
        fax: "081395038965",
        code: "BCA002",
        notes: "note",
        accounts: [
            {
                name: "Asep",
                number: 1008367812522,
                notes: "Lorem 1"
            },
            {
                name: "Ujah",
                number: 1008367812523,
                notes: "Lorem 2"
            }
        ],
        createdBy_id: users[0]._id,
        createdAt: new Date()
    }
];
