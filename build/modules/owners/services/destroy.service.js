import { OwnerRepository } from "../repositories/owner.repository.js";
export class DestroyOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        const ownerRepository = new OwnerRepository(this.db);
        const response = await ownerRepository.delete(id, options);
        return;
    }
}
