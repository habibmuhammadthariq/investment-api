import { BankRepository } from "../repositories/bank.repository.js";
export class ReadManyBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(query) {
        const bankRepository = new BankRepository(this.db);
        const result = await bankRepository.readMany(query);
        return {
            banks: result.data,
            pagination: result.pagination,
        };
    }
}
