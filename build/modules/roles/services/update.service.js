import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";
export class UpdateRoleService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const roleEntity = new RoleEntity({
            name: doc.name,
            permissions: doc.permissions,
        });
        const roleRepository = new RoleRepository(this.db);
        return await roleRepository.update(id, roleEntity.role, { session });
    }
}
