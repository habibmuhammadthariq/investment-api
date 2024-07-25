import { BaseRepository } from "../../../database/base-repository.js";
export class UserRepository extends BaseRepository {
    constructor(db) {
        super(db, "users");
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
    async aggregate(pipeline, query) {
        return await this.collection().aggregate(pipeline, query);
    }
}
