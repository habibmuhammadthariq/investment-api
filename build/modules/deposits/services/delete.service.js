import { DepositRepository } from "../../../modules/deposits/repositories/deposit.repository.js";
import { ReadDepositService } from "../../../modules/deposits/services/read.service.js";
export class DeleteDepositService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const deleteDeposit = {
            deletedBy: doc.deletedBy,
            deleteReason: doc.deleteReason,
            deletedAt: new Date().toISOString(),
            formStatus: "deleted",
        };
        const depositRepository = new DepositRepository(this.db);
        const readDepositService = new ReadDepositService(this.db);
        const deposit = (await readDepositService.handle(id));
        if (deposit.deposit_id) {
            // return parent remaining
            const parentDeposit = (await readDepositService.handle(deposit.deposit_id));
            let remaining = (Number(parentDeposit.remaining) || 0) + Number(deposit.amount);
            if (parentDeposit.isRollOver) {
                remaining = deposit.amount - (Number(parentDeposit.netInterest) || 0);
            }
            await depositRepository.update(deposit.deposit_id, {
                $unset: { renewal_id: 1 },
                $set: { remaining: remaining, renewalAmount: 0 },
            }, {
                session,
                xraw: true,
            });
        }
        return await depositRepository.update(id, deleteDeposit, {
            session,
        });
    }
}
