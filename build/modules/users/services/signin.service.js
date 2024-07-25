import { UserRepository } from "../repositories/user.repository.js";
import { issuer, secretKey } from "../../../config/auth.js";
import { verify } from "../../../utils/hash.js";
import { signNewToken } from "../../../utils/jwt.js";
export class SigninUserService {
    constructor(db) {
        this.db = db;
    }
    async handle(username, password) {
        const iQuery = {
            fields: "",
            filter: { username: username },
            page: 1,
            pageSize: 1,
            sort: {},
        };
        const userRepository = new UserRepository(this.db);
        const result = (await userRepository.readMany(iQuery));
        let isVerified = false;
        if (result.totalDocument === 1) {
            isVerified = await verify(result.data[0].password, password);
        }
        let token = "";
        if (isVerified) {
            token = signNewToken(issuer, secretKey, result.data[0]._id);
        }
        return {
            token: token,
        };
    }
}
