import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { DepositEntity, } from "@src/modules/deposits/entities/deposit.entitiy.js";
export class ReadDepositService {
    constructor(db) {
        this.db = db;
    }
    async handle(id) {
        const depositRepository = new DepositRepository(this.db);
        const result = (await depositRepository.read(id));
        const depositEntity = new DepositEntity(result);
        return depositEntity.deposit;
    }
}
