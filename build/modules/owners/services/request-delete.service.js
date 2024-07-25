import { ObjectId } from "mongodb";
import { OwnerEntity } from "../entities/owner.entity.js";
import { OwnerRepository } from "../repositories/owner.repository.js";
export class RequestDeleteOwnerService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const ownerEntity = new OwnerEntity({
            requestApprovalDeleteTo_id: new ObjectId(doc.approvalTo),
            requestApprovalDeleteReason: doc.reasonDelete,
            requestApprovalDeleteAt: new Date(),
            requestApprovalDeleteStatus: "pending"
        });
        const ownerRepository = new OwnerRepository(this.db);
        return await ownerRepository.update(id, ownerEntity.owner, { session });
    }
}
