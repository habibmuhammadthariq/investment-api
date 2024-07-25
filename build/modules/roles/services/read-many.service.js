import { RoleRepository } from "../repositories/role.repository.js";
export class ReadManyRoleService {
    constructor(db) {
        this.db = db;
    }
    async handle(query) {
        const roleRepository = new RoleRepository(this.db);
        const result = await roleRepository.readMany(query);
        return {
            roles: result.data,
            pagination: result.pagination,
        };
    }
}
