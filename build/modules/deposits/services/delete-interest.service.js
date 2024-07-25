import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
export class DeleteInterestService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const depositRepository = new DepositRepository(this.db);
        const deposit = (await depositRepository.read(id));
        const interestPayment = deposit.interestPayment;
        interestPayment.deletedAt = new Date().toISOString();
        interestPayment.deletedBy = doc.deletedBy;
        interestPayment.deleteReason = doc.deleteReason;
        return await depositRepository.update(id, {
            $unset: { interestPayment: 1 },
            $push: { interestPaymentArchives: interestPayment },
        }, {
            session,
            xraw: true,
        });
    }
}
