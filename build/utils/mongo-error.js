import { ApiError, BaseError, find } from "@point-hub/express-error-handler";
export default class MongoError extends BaseError {
    constructor(err) {
        const error = find(400);
        if (err.code === 121) {
            error.errors = {};
            const errorMessage = err.errInfo?.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied;
            errorMessage.forEach((element) => {
                const obj = {};
                obj[element.propertyName] = element.details;
                error.errors = obj;
            });
        }
        else if (err.code === 11000) {
            const errors = {};
            const fields = Object.keys(err.keyPattern);
            for (const field of fields) {
                errors[field] = `The ${field} is exists.`;
            }
            throw new ApiError(422, errors);
        }
        super(error);
    }
    get isOperational() {
        return true;
    }
}
