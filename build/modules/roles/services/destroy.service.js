import { RoleRepository } from "../repositories/role.repository.js";
export class DestroyRoleService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        const roleRepository = new RoleRepository(this.db);
        const response = await roleRepository.delete(id, options);
        return;
    }
}
