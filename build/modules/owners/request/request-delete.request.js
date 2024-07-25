import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
export const validate = (body) => {
    const validation = new Validatorjs(body, {
        approvalTo: "required",
        reasonDelete: "required"
    });
    if (validation.fails()) {
        throw new ApiError(422, validation.errors.errors);
    }
};
