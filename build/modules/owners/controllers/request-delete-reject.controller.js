import { validate } from "../request/delete-reject.request.js";
import { RequestDeleteRejectOwnerService } from "../services/request-delete-reject.service.js";
import { db } from "../../../database/database.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
import { ApiError } from "@point-hub/express-error-handler";
export const requestDeleteReject = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const ownerRepository = new OwnerRepository(db);
        const result = (await ownerRepository.read(req.params.id));
        if (result.requestApprovalDeleteStatus !== "pending")
            throw new ApiError(404);
        if (req.user?._id?.toString() !== result.requestApprovalDeleteTo_id?.toString())
            throw new ApiError(403);
        const requestDeleteRejectOwnerService = new RequestDeleteRejectOwnerService(db);
        await requestDeleteRejectOwnerService.handle(req.params.id, req.body, session);
        await db.commitTransaction();
        res.status(204).json();
    }
    catch (error) {
        await db.abortTransaction();
        next(error);
    }
    finally {
        await db.endSession();
    }
};
