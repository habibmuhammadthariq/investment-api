import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
export class DeleteWithdrawalService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, withdrawalId, doc, session) {
        const depositRepository = new DepositRepository(this.db);
        const deposit = (await depositRepository.read(id));
        let paymentAmount = 0;
        if (deposit.withdrawal?.payments) {
            for (const payment of deposit.withdrawal.payments) {
                paymentAmount += Number(payment.amount);
            }
        }
        const remaining = Number(deposit.remaining || 0) + paymentAmount;
        const withdrawal = deposit.withdrawal;
        withdrawal.deletedAt = new Date().toISOString();
        withdrawal.deletedBy = doc.deletedBy;
        withdrawal.deleteReason = doc.deleteReason;
        return await depositRepository.update(id, {
            $unset: { withdrawal: 1 },
            $push: { withdrawalArchives: withdrawal },
            $set: { remaining: remaining },
        }, {
            session,
            xraw: true,
        });
    }
}
