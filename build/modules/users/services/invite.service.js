import { ObjectId } from "mongodb";
import { UserEntity } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
export class InviteUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(doc, options) {
        const userEntity = new UserEntity({
            username: doc.username,
            email: doc.email,
            name: doc.name,
            lastname: doc.lastname,
            mobilephone: doc.mobilephone,
            role_id: new ObjectId(doc.role_id),
        });
        // await userEntity.generateRandomUsername();
        await userEntity.generateRandomPassword();
        userEntity.generateEmailValidationCode();
        const userRepository = new UserRepository(this.db);
        const createResponse = await userRepository.create(userEntity.user, options);
        const readResponse = await userRepository.read(createResponse._id, { session: options?.session });
        return {
            _id: createResponse._id,
            email: readResponse.email,
            name: readResponse.name,
            emailVerificaitonCode: readResponse.emailVerificaitonCode,
            acknowledge: createResponse.acknowledged,
        };
    }
}
