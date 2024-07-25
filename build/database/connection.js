import { fileSearch } from "@point-hub/express-utils";
export default class DatabaseConnection {
    constructor(adapter) {
        this.adapter = adapter;
    }
    url() {
        return this.adapter.url();
    }
    async open() {
        await this.adapter.open();
    }
    async close() {
        await this.adapter.close();
    }
    database(name) {
        this.adapter.database(name);
        return this;
    }
    listCollections() {
        return this.adapter.listCollections();
    }
    collection(name) {
        this.adapter.collection(name);
        return this;
    }
    startSession() {
        this.adapter.startSession();
        return this.adapter.session;
    }
    async endSession() {
        await this.adapter.endSession();
        return this;
    }
    startTransaction() {
        this.adapter.startTransaction();
        return this;
    }
    async commitTransaction() {
        await this.adapter.commitTransaction();
        return this;
    }
    async abortTransaction() {
        await this.adapter.abortTransaction();
        return this;
    }
    async create(doc, options) {
        return await this.adapter.create(doc, options);
    }
    async createMany(docs, options) {
        return await this.adapter.createMany(docs, options);
    }
    async read(id, options) {
        return await this.adapter.read(id, options);
    }
    async readMany(query, options) {
        return await this.adapter.readMany(query, options);
    }
    async update(id, doc, options) {
        return await this.adapter.update(id, doc, options);
    }
    async delete(id, options) {
        return await this.adapter.delete(id, options);
    }
    async deleteAll(options) {
        return await this.adapter.deleteAll(options);
    }
    async aggregate(pipeline, query) {
        return await this.adapter.aggregate(pipeline, query);
    }
    createIndex(name, spec, options) {
        this.adapter.createIndex(name, spec, options);
    }
    async createCollection(name, options) {
        this.adapter.createCollection(name, options);
    }
    async dropCollection(name, options) {
        this.adapter.dropCollection(name, options);
    }
    async updateSchema(name, schema) {
        this.adapter.updateSchema(name, schema);
    }
    /**
     * Create Collections
     * ==================
     * Create new collection if not exists and update schema validation or indexes
     */
    async createCollections() {
        const object = await fileSearch("/*.schema.ts", "./src/modules", {
            maxDeep: 2,
            regExp: true,
        });
        for (const property in object) {
            const path = `../modules/${object[property].path
                .replace("\\", "/")
                .replace(".ts", ".js")}`;
            const { createCollection } = await import(path);
            await createCollection(this);
        }
    }
    /**
     * Drop Collections
     * ==================
     * Drop collections function is for testing purpose, so every test can generate fresh database
     */
    async dropCollections() {
        const object = await fileSearch("/*.schema.ts", "./src/modules", {
            maxDeep: 2,
            regExp: true,
        });
        for (const property in object) {
            const path = `../modules/${object[property].path
                .replace("\\", "/")
                .replace(".ts", ".js")}`;
            const { dropCollection } = await import(path);
            await dropCollection(this);
        }
    }
}
