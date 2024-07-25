import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";
export class CreateRoleService {
    constructor(db) {
        this.db = db;
    }
    async handle(doc, session) {
        const roleEntity = new RoleEntity({
            name: doc.name,
            permissions: doc.permissions,
        });
        const roleRepository = new RoleRepository(this.db);
        return await roleRepository.create(roleEntity.role, { session });
    }
}
