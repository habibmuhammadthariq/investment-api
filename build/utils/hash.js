import { hash as hashData, verify as verifyData } from "argon2";
import objectHash from "object-hash";
export const hash = async (data) => {
    try {
        return await hashData(data);
    }
    catch (error) {
        throw error;
    }
};
export const verify = async (encryptedData, plainData) => {
    try {
        return await verifyData(encryptedData, plainData);
    }
    catch (error) {
        throw error;
    }
};
export const hashObject = (obj) => {
    return objectHash(obj);
};
