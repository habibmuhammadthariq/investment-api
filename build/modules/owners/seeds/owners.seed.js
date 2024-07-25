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
export const ownersSeed = [
    {
        name: "John Doe",
        createdBy_id: users[0]._id,
        createdAt: new Date()
    },
];
