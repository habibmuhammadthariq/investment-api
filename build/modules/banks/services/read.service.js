import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
export class ReadBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id) {
        const bankRepository = new BankRepository(this.db);
        const result = (await bankRepository.read(id));
        const bank = {
            _id: result._id,
            name: result.name,
            createdBy_id: result.createdBy_id,
            createdAt: result.createdAt,
        };
        const bankEntity = new BankEntity(bank);
        return bankEntity.bank;
    }
}
