import { UserRepository } from "@src/modules/users/repositories/user.repository.js";
export class ReadUserByEmailService {
    constructor(db) {
        this.db = db;
    }
    async handle(email) {
        const query = {
            fields: "",
            filter: { email: email },
            page: 1,
            pageSize: 1,
            sort: {},
        };
        const userRepository = new UserRepository(this.db);
        const result = await userRepository.readMany(query);
        return result.data[0];
    }
}
