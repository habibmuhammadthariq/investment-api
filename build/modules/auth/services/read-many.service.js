import { UserRepository } from "../repositories/user.repository.js";
export class ReadManyUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(query) {
        const userRepository = new UserRepository(this.db);
        return await userRepository.readMany(query);
    }
}
