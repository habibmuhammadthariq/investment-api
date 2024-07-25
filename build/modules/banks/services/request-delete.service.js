import { ObjectId } from 'mongodb';
import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
export class RequestDeleteBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const bankEntity = new BankEntity({
            requestApprovalDeleteTo_id: new ObjectId(doc.approvalTo),
            requestApprovalDeleteReason: doc.reasonDelete,
            requestApprovalDeleteAt: new Date(),
            requestApprovalDeleteStatus: "pending"
        });
        const bankRepository = new BankRepository(this.db);
        return await bankRepository.update(id, bankEntity.bank, { session });
    }
}
