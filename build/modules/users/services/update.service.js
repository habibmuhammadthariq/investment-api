import { ObjectId } from "mongodb";
import { UserEntity } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
export class UpdateUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const userEntity = new UserEntity({
            username: doc.username,
            // password: doc.password,
            email: doc.email,
            name: doc.name,
            lastname: doc.lastname,
            mobilephone: doc.mobilephone,
            role_id: new ObjectId(doc.role_id),
        });
        const userRepository = new UserRepository(this.db);
        return await userRepository.update(id, userEntity.user, { session });
    }
}
