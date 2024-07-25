import { OwnerRepository } from "../repositories/owner.repository.js";
export class ReadManyOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(query) {
        const ownerRepository = new OwnerRepository(this.db);
        const result = await ownerRepository.readMany(query);
        return {
            owners: result.data,
            pagination: result.pagination,
        };
    }
}
