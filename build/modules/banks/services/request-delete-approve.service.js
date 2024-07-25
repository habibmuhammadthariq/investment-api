import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
export class RequestDeleteApproveBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, session) {
        const bankEntity = new BankEntity({
            requestApprovalDeleteReasonReject: null,
            requestApprovalDeleteStatus: "approved"
        });
        const bankRepository = new BankRepository(this.db);
        return await bankRepository.update(id, bankEntity.bank, { session });
    }
}
