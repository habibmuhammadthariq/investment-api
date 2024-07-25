export const name = "roles";
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
            required: ["name"],
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
                permissions: {
                    bsonType: "array",
                    items: {
                        bsonType: "string",
                        properties: {},
                    },
                },
            },
        });
        await db.createIndex(name, { name: -1 }, {
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
