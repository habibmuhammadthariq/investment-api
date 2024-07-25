export const name = "banks";
export const restrictedFields = [];
const isExists = async (db) => {
    const collections = (await db.listCollections());
    return collections.some(function (el) {
        return el.name === name;
    });
};
export async function createCollection(db) {
    try {
        if (!(await isExists(db))) {
            await db.createCollection(name);
        }
        await db.updateSchema(name, {
            bsonType: "object",
            required: ["name", "branch", "code", "notes", "accounts"],
            properties: {
                createdAt: {
                    bsonType: "date",
                    description: "must be a date and is required",
                },
                updatedAt: {
                    bsonType: "date",
                    description: "must be a date and is required",
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required",
                },
                branch: {
                    bsonType: "string",
                    description: "must be a string and is required",
                },
                code: {
                    bsonType: "string",
                    description: "must be a string and is required",
                },
                notes: {
                    bsonType: "string",
                    description: "must be a string and is required",
                },
                accounts: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["number"],
                        properties: {
                            number: {
                                bsonType: "number",
                                description: "must be a number and is required",
                            }
                        },
                    },
                },
            },
        });
        await db.createIndex(name, { name: -1, code: -1, branch: -1 }, {
            unique: true,
            collation: {
                locale: "en",
                strength: 2,
            },
        });
    }
    catch (error) {
        throw error;
    }
}
export async function dropCollection(db) {
    try {
        if (await isExists(db)) {
            await db.dropCollection(name);
        }
    }
    catch (error) {
        throw error;
    }
}
