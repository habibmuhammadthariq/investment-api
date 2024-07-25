import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class RestoreOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, session) {
        const ownerEntity = new OwnerEntity({
            archivedAt: null,
            archivedBy_id: null
        });
        const ownerRepository = new OwnerRepository(this.db);
        return await ownerRepository.update(id, ownerEntity.owner, { session });
    }
}
