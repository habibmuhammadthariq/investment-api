import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class RequestDeleteApproveOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, session) {
        const ownerEntity = new OwnerEntity({
            requestApprovalDeleteReasonReject: null,
            requestApprovalDeleteStatus: "approved"
        });
        const ownerRepository = new OwnerRepository(this.db);
        return await ownerRepository.update(id, ownerEntity.owner, { session });
    }
}
