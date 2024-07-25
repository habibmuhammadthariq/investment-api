import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class CreateOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(doc, session) {
        const ownerEntity = new OwnerEntity({
            name: doc.name,
            createdBy_id: doc.createdBy_id
        });
        const ownerRepository = new OwnerRepository(this.db);
        return await ownerRepository.create(ownerEntity.owner, { session });
    }
}
