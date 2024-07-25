import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class UpdateOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const ownerEntity = new OwnerEntity({
            name: doc.name,
            updatedBy_id: doc.updatedBy_id
        });
        const ownerRepository = new OwnerRepository(this.db);
        return await ownerRepository.update(id, ownerEntity.owner, { session });
    }
}
