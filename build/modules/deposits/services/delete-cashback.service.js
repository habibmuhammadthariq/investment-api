import { DepositRepository } from "../../../modules/deposits/repositories/deposit.repository.js";
export class DeleteCashbackService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const depositRepository = new DepositRepository(this.db);
        const deposit = (await depositRepository.read(id));
        const cashbackPayment = deposit.cashbackPayment;
        cashbackPayment.deletedAt = new Date().toISOString();
        cashbackPayment.deletedBy = doc.deletedBy;
        cashbackPayment.deleteReason = doc.deleteReason;
        return await depositRepository.update(id, {
            $unset: { cashbackPayment: 1 },
            $push: { cashbackPaymentArchives: cashbackPayment },
        }, {
            session,
            xraw: true,
        });
    }
}
