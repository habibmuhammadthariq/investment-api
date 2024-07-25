import { DepositEntity, } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
export class UpdateDepositService {
    constructor(db) {
        this.db = db;
    }
    async handle(id, doc, session) {
        const depositEntity = new DepositEntity({
            date: doc.date,
            bilyetNumber: doc.bilyetNumber,
            bank: {
                _id: doc.bank._id,
                name: doc.bank.name,
            },
            account: {
                number: doc.account.number,
                name: doc.account.name,
            },
            owner: {
                _id: doc.owner._id,
                name: doc.owner.name,
            },
            baseDate: doc.baseDate,
            tenor: doc.tenor,
            dueDate: doc.dueDate,
            isRollOver: doc.isRollOver,
            amount: Number(doc.amount),
            remaining: Number(doc.remaining),
            sourceBank: {
                _id: doc.sourceBank._id,
                name: doc.sourceBank.name,
            },
            sourceBankAccount: {
                number: doc.sourceBankAccount.number,
                name: doc.sourceBankAccount.name,
            },
            recipientBank: {
                _id: doc.recipientBank._id,
                name: doc.recipientBank.name,
            },
            recipientBankAccount: {
                number: doc.recipientBankAccount.number,
                name: doc.recipientBankAccount.name,
            },
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
            formStatus: doc.formStatus,
            note: doc.note,
            updatedBy: doc.updatedBy,
            cashbackPayments: [],
            interestPayments: [],
            withdrawals: [],
        });
        const depositRepository = new DepositRepository(this.db);
        return await depositRepository.update(id, depositEntity.deposit, {
            session,
        });
    }
}
