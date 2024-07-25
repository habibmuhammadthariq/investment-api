import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class ReadOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id) {
        const ownerRepository = new OwnerRepository(this.db);
        const result = (await ownerRepository.read(id));
        const owner = {
            _id: result._id,
            name: result.name,
            createdBy_id: result.createdBy_id,
            createdAt: result.createdAt,
        };
        const ownerEntity = new OwnerEntity(owner);
        return ownerEntity.owner;
    }
}
