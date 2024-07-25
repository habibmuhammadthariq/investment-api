import { ObjectId } from "mongodb";
import { BankEntity } from "../entities/bank.entity.js";
import { BankRepository } from "../repositories/bank.repository.js";
export class ArchiveBankService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const bankEntity = new BankEntity({
            archivedBy_id: new ObjectId(doc.archivedBy_id),
            archivedAt: new Date()
        });
        const bankRepository = new BankRepository(this.db);
        return await bankRepository.update(id, bankEntity.bank, { session });
    }
}
