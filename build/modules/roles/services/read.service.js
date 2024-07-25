import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";
export class ReadRoleService {
    constructor(db) {
        this.db = db;
    }
    async handle(id) {
        const roleRepository = new RoleRepository(this.db);
        const result = (await roleRepository.read(id));
        const role = {
            _id: result._id,
            name: result.name,
            permissions: result.permissions,
        };
        const roleEntity = new RoleEntity(role);
        return roleEntity.role;
    }
}
