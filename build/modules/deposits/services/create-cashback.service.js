import { DepositRepository } from "../../../modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";
export class CreateCashbackService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const depositRepository = new DepositRepository(this.db);
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
        let totalRemaining = 0;
        for (const cashback of doc.cashbacks) {
            totalRemaining += Number(cashback.amount);
        }
        for (const cashback of doc.cashbacks) {
            cashback.amount = Number(cashback.amount);
            cashback.received = Number(cashback.received);
            totalRemaining -= Number(cashback.received);
        }
        if (totalRemaining == 0) {
            doc.status = "complete";
        }
        else {
            doc.status = "incomplete";
        }
        await depositRepository.update(id, {
            $set: { cashbackPayment: doc },
        }, {
            session,
            xraw: true,
        });
    }
}
