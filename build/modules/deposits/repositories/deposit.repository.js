import { BaseRepository } from "@src/database/base-repository.js";
export class DepositRepository extends BaseRepository {
    constructor(db) {
        super(db, "deposits");
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
    async aggregate(pipeline, query) {
        return await this.collection().aggregate(pipeline, query);
    }
    async update(id, document, options) {
        return await this.collection().update(id, document, options);
    }
    async delete(id, options) {
        return await this.collection().delete(id, options);
    }
}
