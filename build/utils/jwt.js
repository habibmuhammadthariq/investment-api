import pkg from "jsonwebtoken";
// eslint-disable-next-line import/no-named-as-default-member
const { sign, verify } = pkg;
export const tokenType = "Bearer";
export const getTokenFromHeader = (authorization) => {
    if (authorization && authorization.split(" ")[0] === tokenType) {
        return authorization.split(" ")[1];
    }
};
export const signNewToken = (issuer, secret, id) => {
    const date = new Date().getTime();
    // expired in 24 hour
    const exp = new Date().setTime(date + 1000 * 60 * 60 * 24);
    return sign({
        iss: issuer,
        sub: id,
        iat: date,
        exp: exp,
    }, secret);
};
export const generateRefreshToken = (issuer, secret, id) => {
    const date = new Date().getTime();
    // expired in 1 month
    const exp = new Date().setTime(date + 1000 * 60 * 60 * 24 * 30);
    return sign({
        iss: issuer,
        sub: id,
        iat: date,
        exp: exp,
    }, secret);
};
export const verifyToken = (token, secret) => {
    return verify(token, secret);
};
export const isExpired = (exp) => {
    if (new Date().getTime() < exp) {
        return false;
    }
    return true;
};
