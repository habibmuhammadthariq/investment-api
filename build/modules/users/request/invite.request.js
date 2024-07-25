import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
export const validate = (body) => {
    const validation = new Validatorjs(body, {
        username: "required",
        name: "required",
        lastname: "required",
        mobilephone: "required",
        email: "required|email",
        role_id: "required",
    });
    if (validation.fails()) {
        throw new ApiError(422, validation.errors.errors);
    }
};
