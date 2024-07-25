import { config } from "dotenv";
config();
export const connection = {
    default: "mongodb",
    mongodb: {
        driver: "mongodb",
        protocol: "mongodb",
        url: process.env.DATABASE_URL,
        host: "localhost",
        port: 27017,
        name: process.env.DATABASE_NAME,
        username: "",
        password: "",
    },
};
