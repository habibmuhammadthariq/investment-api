import { BankRepository } from "../repositories/bank.repository.js";
export class DestroyBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        const bankRepository = new BankRepository(this.db);
        const response = await bankRepository.delete(id, options);
        return;
    }
}
