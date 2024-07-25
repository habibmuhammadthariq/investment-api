import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class RequestDeleteRejectOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const ownerEntity = new OwnerEntity({
            requestApprovalDeleteReasonReject: doc.reasonReject,
            requestApprovalDeleteStatus: "rejected"
        });
        const ownerRepository = new OwnerRepository(this.db);
        return await ownerRepository.update(id, ownerEntity.owner, { session });
    }
}
