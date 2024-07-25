import { ObjectId } from "mongodb";
import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class ArchiveOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const ownerEntity = new OwnerEntity({
            archivedBy_id: new ObjectId(doc.archivedBy_id),
            archivedAt: new Date(),
        });
        const ownerRepository = new OwnerRepository(this.db);
        return await ownerRepository.update(id, ownerEntity.owner, { session });
    }
}
