import { ApiError } from '@point-hub/express-error-handler';
const permissions = (...allowedPermissions) => {
    return (req, _, next) => {
        const result = req.user?.permissions?.map(permission => allowedPermissions.includes(permission)).find(val => val === true);
        if (!result) {
            if (allowedPermissions.length == 1) {
                const permission = allowedPermissions[0].split(".");
                throw new ApiError(403, { message: "Don't have necessary permission for " + permission[1] + " " + permission[0] });
            }
            else {
                throw new ApiError(403);
            }
        }
        next();
    };
};
export default permissions;
