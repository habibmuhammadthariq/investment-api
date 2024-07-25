import { BaseRepository } from "@src/database/base-repository.js";
export class RoleRepository extends BaseRepository {
    constructor(db) {
        super(db, "roles");
    }
    async create(doc, options) {
        return await this.collection().create(doc, options);
    }
    async read(id, options) {
        return await this.collection().read(id, options);
    }
    async readMany(query, options) {
        return await this.collection().readMany(query, options);
    }
    async update(id, document, options) {
        return await this.collection().update(id, document, options);
    }
    async delete(id, options) {
        return await this.collection().delete(id, options);
    }
}
