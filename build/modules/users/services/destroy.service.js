import { UserRepository } from "../repositories/user.repository.js";
export class DestroyUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        const userRepository = new UserRepository(this.db);
        return await userRepository.delete(id, options);
    }
}
