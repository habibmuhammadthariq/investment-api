import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
export class RequestDeleteRejectBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const bankEntity = new BankEntity({
            requestApprovalDeleteReasonReject: doc.reasonReject,
            requestApprovalDeleteStatus: "rejected"
        });
        const bankRepository = new BankRepository(this.db);
        return await bankRepository.update(id, bankEntity.bank, { session });
    }
}
