import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
export class RestoreBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, session) {
        const bankEntity = new BankEntity({
            archivedAt: null,
            archivedBy_id: null
        });
        const bankRepository = new BankRepository(this.db);
        return await bankRepository.update(id, bankEntity.bank, { session });
    }
}
