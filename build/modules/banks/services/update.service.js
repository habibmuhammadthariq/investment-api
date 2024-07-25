import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
export class UpdateBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const bankEntity = new BankEntity({
            name: doc.name,
            branch: doc.branch,
            address: doc.address,
            phone: doc.phone,
            fax: doc.fax,
            code: doc.code,
            notes: doc.notes,
            accounts: doc.accounts,
            updatedBy_id: doc.updatedBy_id
        });
        const bankRepository = new BankRepository(this.db);
        return await bankRepository.update(id, bankEntity.bank, { session });
    }
}
