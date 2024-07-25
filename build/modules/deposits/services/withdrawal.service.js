import { DepositRepository } from "../../../modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";
export class WithdrawalService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const depositRepository = new DepositRepository(this.db);
        const deposit = (await depositRepository.read(id));
        if (doc._id) {
            doc.updatedAt = new Date().toISOString();
            doc.updatedBy = doc.user;
            doc._id = new ObjectId(doc._id);
        }
        else {
            doc.createdAt = new Date().toISOString();
            doc.createdBy = doc.user;
            doc._id = new ObjectId();
        }
        delete doc.user;
        const payments = [];
        let remaining = Number(deposit.amount);
        const renewalAmount = Number(deposit.renewalAmount || 0);
        if (deposit.isRollOver && renewalAmount > 0) {
            remaining = Number(deposit.amount) - Number(deposit.renewalAmount) + Number(deposit.netInterest);
        }
        else if (renewalAmount > 0) {
            remaining = Number(deposit.amount) - Number(deposit.renewalAmount);
        }
        for (const payment of doc.payments) {
            payments.push({
                bank: payment.bank,
                account: payment.account,
                date: payment.date,
                amount: Number(payment.amount),
                remaining: remaining,
            });
            remaining -= Number(payment.amount);
        }
        if (remaining == 0) {
            doc.status = "complete";
        }
        else {
            doc.status = "incomplete";
        }
        doc.payments = payments;
        await depositRepository.update(id, {
            $set: { withdrawal: doc, remaining: remaining },
        }, {
            session,
            xraw: true,
        });
    }
}
