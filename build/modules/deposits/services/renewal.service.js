import { DepositEntity, } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";
export class RenewalService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const iQuery = {
            fields: "",
            filter: { bilyetNumber: doc.bilyetNumber, index: 0 },
            archived: false,
            search: {},
            page: 1,
            pageSize: 1,
            sort: {},
        };
        const depositRepository = new DepositRepository(this.db);
        const deposit = (await depositRepository.read(id));
        const depositEntity = new DepositEntity(deposit);
        const mainDeposits = await depositRepository.readMany(iQuery);
        let number = doc.number;
        if (mainDeposits.data && mainDeposits.data[0]) {
            number = mainDeposits.data[0].number + '/' + ((depositEntity.deposit.index || 0) + 1);
        }
        const newDepositEntity = new DepositEntity({
            _id: new ObjectId(),
            deposit_id: new ObjectId(id),
            date: doc.date,
            bilyetNumber: depositEntity.deposit.bilyetNumber,
            number: number,
            bank: depositEntity.deposit.bank,
            account: depositEntity.deposit.account,
            owner: depositEntity.deposit.owner,
            baseDate: doc.baseDate,
            tenor: doc.tenor,
            dueDate: doc.dueDate,
            isRollOver: doc.isRollOver,
            amount: Number(doc.amount),
            remaining: Number(doc.amount),
            sourceBank: depositEntity.deposit.sourceBank,
            sourceBankAccount: depositEntity.deposit.sourceBankAccount,
            recipientBank: depositEntity.deposit.recipientBank,
            recipientBankAccount: depositEntity.deposit.recipientBankAccount,
            paymentMethod: doc.paymentMethod,
            interestRate: doc.interestRate,
            baseInterest: doc.baseInterest,
            taxRate: doc.taxRate,
            grossInterest: doc.grossInterest,
            taxAmount: doc.taxAmount,
            returns: doc.returns,
            netInterest: doc.netInterest,
            isCashback: doc.isCashback,
            cashbacks: doc.cashbacks,
            note: doc.note,
            formStatus: doc.formStatus,
            createdBy: doc.createdBy,
            index: (depositEntity.deposit.index || 0) + 1
        });
        const created = await depositRepository.create(newDepositEntity.deposit, {
            session,
        });
        let remaining = Number(deposit.remaining || 0);
        let renewalAmount = newDepositEntity.deposit.amount;
        if (deposit.isRollOver) {
            renewalAmount = newDepositEntity.deposit.amount - Number(deposit.netInterest || 0);
        }
        remaining -= renewalAmount;
        await depositRepository.update(id, {
            $set: { renewal_id: new ObjectId(created._id), remaining: remaining, renewalAmount: newDepositEntity.deposit.amount },
        }, {
            session,
            xraw: true,
        });
        return created;
    }
}
