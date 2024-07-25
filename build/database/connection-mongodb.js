import { ApiError } from "@point-hub/express-error-handler";
import { MongoClient, ObjectId, MongoServerError, } from "mongodb";
import { fields, limit, page, skip, sort } from "./mongodb-util.js";
import MongoError from "@src/utils/mongo-error.js";
export default class MongoDbConnection {
    constructor(config) {
        const options = {};
        this.config = config;
        this.client = new MongoClient(this.url(), options);
    }
    url() {
        return this.config.url ?? "";
    }
    /**
     * Open connection to connect the client to the server (optional starting in v4.7)
     * https://www.mongodb.com/docs/drivers/node/v4.8/fundamentals/connection/connect/
     */
    async open() {
        await this.client.connect();
    }
    async close() {
        await this.client.close();
    }
    database(name, options) {
        this._database = this.client.db(name, options);
        return this;
    }
    async listCollections() {
        if (!this._database) {
            throw new Error("Database not found");
        }
        return await this._database.listCollections().toArray();
    }
    collection(name, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        this._collection = this._database.collection(name, options);
        return this;
    }
    async createIndex(name, spec, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.createIndex(name, spec, options);
        return this;
    }
    async updateSchema(name, schema) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.command({
            collMod: name,
            validator: {
                $jsonSchema: schema,
            },
        });
    }
    async createCollection(name, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.createCollection(name, options);
    }
    async dropCollection(name, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.dropCollection(name, options);
    }
    async create(doc, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        try {
            const insertOneOptions = options;
            insertOneOptions.writeConcern = {
                w: "majority",
            };
            // inject date of created
            doc.createdAt = new Date();
            const response = await this._collection.insertOne(doc, insertOneOptions);
            return {
                acknowledged: response.acknowledged,
                _id: response.insertedId.toString(),
            };
        }
        catch (error) {
            if (error instanceof MongoServerError) {
                throw new MongoError(error);
            }
            throw error;
        }
    }
    async createMany(docs, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        try {
            const insertOneOptions = options;
            // inject date of created
            // doc.createdAt = new Date();
            const response = await this._collection.insertMany(docs, insertOneOptions);
            return {
                acknowledged: response.acknowledged,
                _id: "response.insertedId.toString()",
            };
        }
        catch (error) {
            if (error instanceof MongoServerError) {
                throw new MongoError(error);
            }
            throw error;
        }
    }
    async read(id, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        if (!ObjectId.isValid(id)) {
            throw new ApiError(404);
        }
        const readOptions = options;
        const result = await this._collection.findOne({
            _id: new ObjectId(id),
        }, readOptions);
        if (!result) {
            throw new ApiError(404);
        }
        return {
            ...result,
        };
    }
    async readMany(query, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        let search = {};
        let searchArr = [];
        if (query.search) {
            for (const key in query.search) {
                searchArr.push({ [key]: { $regex: query.search[key], $options: "i" } });
            }
            if (searchArr.length > 0) {
                search = { $or: searchArr };
            }
        }
        const readOptions = options;
        const cursor = this._collection
            .find({ ...query.filter, ...search }, readOptions)
            .collation({ locale: "en" })
            .limit(limit(query.pageSize))
            .skip(skip(page(query.page), limit(query.pageSize)));
        let querySort = [];
        if (query.sort) {
            for (const key in query.sort) {
                querySort.push(`${query.sort[key] === "desc" ? "-" : ""}${key}`);
            }
        }
        const sortBy = querySort.join(",");
        if (sort(sortBy)) {
            cursor.sort(sort(sortBy));
        }
        if (fields(query.fields, query.restrictedFields)) {
            cursor.project(fields(query.fields, query.restrictedFields));
        }
        const result = await cursor.toArray();
        const totalDocument = await this._collection.countDocuments({ ...query.filter, ...search }, readOptions);
        return {
            data: result,
            pagination: {
                page: page(query.page),
                pageCount: Math.ceil(totalDocument / limit(query.pageSize)),
                pageSize: limit(query.pageSize),
                totalDocument,
            },
        };
    }
    async update(id, document, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const updateOptions = options;
        try {
            let result;
            if (options?.xraw === true) {
                result = await this._collection.updateOne({ _id: new ObjectId(id) }, document, updateOptions);
            }
            else {
                result = await this._collection.updateOne({ _id: new ObjectId(id) }, { $set: document }, updateOptions);
            }
            return {
                acknowledged: result.acknowledged,
                modifiedCount: result.modifiedCount,
                upsertedId: result.upsertedId,
                upsertedCount: result.upsertedCount,
                matchedCount: result.matchedCount,
            };
        }
        catch (error) {
            if (error instanceof MongoServerError) {
                throw new MongoError(error);
            }
            throw error;
        }
    }
    async delete(id, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const deleteOptions = options;
        const result = await this._collection.deleteOne({
            _id: new ObjectId(id),
        }, deleteOptions);
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }
    async deleteMany(id, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const deleteOptions = options;
        const result = await this._collection.deleteMany({
            _id: new ObjectId(id),
        }, deleteOptions);
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }
    async deleteAll(options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const deleteOptions = options;
        const result = await this._collection.deleteMany({}, deleteOptions);
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }
    async aggregate(pipeline, query, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const aggregateOptions = options;
        const cursor = this._collection.aggregate([
            ...pipeline,
            { $skip: (query.page - 1) * query.pageSize },
            { $limit: query.pageSize },
        ], aggregateOptions);
        const result = await cursor.toArray();
        const cursorPagination = this._collection.aggregate([...pipeline, { $count: "totalDocument" }], aggregateOptions);
        const resultPagination = await cursorPagination.toArray();
        const totalDocument = resultPagination.length
            ? resultPagination[0].totalDocument
            : 0;
        return {
            data: result,
            pagination: {
                page: page(query.page),
                pageCount: Math.ceil(totalDocument / limit(query.pageSize)),
                pageSize: limit(query.pageSize),
                totalDocument,
            },
        };
    }
    startSession() {
        this.session = this.client.startSession();
        return this.session;
    }
    async endSession() {
        await this.session?.endSession();
        return this;
    }
    startTransaction() {
        this.session?.startTransaction();
        return this;
    }
    async commitTransaction() {
        await this.session?.commitTransaction();
        return this;
    }
    async abortTransaction() {
        await this.session?.abortTransaction();
        return this;
    }
}
