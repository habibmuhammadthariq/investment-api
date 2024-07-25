import { db } from "../../../database/database.js";
import { RoleRepository } from "../../../modules/roles/repositories/role.repository.js";
import { hash } from "../../../utils/hash.js";
const roleRepository = new RoleRepository(db);
const result = await roleRepository.readMany({
    fields: "",
    filter: {},
    page: 1,
    pageSize: 2,
    sort: {},
});
const roles = result.data;
export const usersSeed = [
    {
        username: "admin",
        email: "admin@example.com",
        password: await hash("admin123"),
        name: "Admin",
        role_id: roles[0]._id,
    },
    {
        username: "user",
        email: "user@example.com",
        password: await hash("user1234"),
        name: "User",
        role_id: roles[1]._id,
    },
];
