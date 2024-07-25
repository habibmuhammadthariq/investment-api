import { ObjectId } from "mongodb";
import { hash } from "../../../utils/hash.js";
export const restricted = ["password"];
export const hasOne = {
    role: {
        from: "roles",
        localField: "role_id",
        foreignField: "_id",
        as: "role",
    },
};
export const addFields = {
    role: { $arrayElemAt: ["$role", 0] },
};
export class UserEntity {
    constructor(user) {
        this.user = user;
    }
    generateEmailValidationCode() {
        this.user.emailValidationCode = new ObjectId().toString();
    }
    async generateRandomUsername() {
        this.user.username = `username-${Math.random()}`;
    }
    async generateRandomPassword() {
        this.user.password = await hash(new Date().toString());
    }
    suspendUser() {
        this.user.status = "suspended";
    }
}
