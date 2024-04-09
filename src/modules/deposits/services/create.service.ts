import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import { DepositEntity } from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";

export class CreateDepositService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(doc: DocumentInterface, session: unknown) {
    const depositEntity = new DepositEntity({
      date: doc.date,
      bilyetNumber: doc.bilyetNumber,
      number: doc.number,
      bank: doc.bank,
      owner: doc.owner,
      baseDate: doc.baseDate,
      tenor: doc.tenor,
      dueDate: doc.dueDate,
      isRollOver: doc.isRollOver,
      amount: doc.amount,
      remaining: doc.remaining,
      sourceBank: doc.sourceBank,
      recipientBank: doc.recipientBank,
      paymentMethod: doc.paymentMethod,
      interestRate: doc.interestRate,
      baseInterest: doc.baseInterest,
      taxRate: doc.taxRate,
      grossInterest: doc.grossInterest,
      taxAmount: doc.taxAmount,
      interests: doc.interests,
      netInterest: doc.netInterest,
      isCashback: doc.isCashback,
      cashbacks: doc.cashbacks,
      note: doc.note,
      createdBy: doc.createdBy,
    });

    const depositRepository = new DepositRepository(this.db);
    return depositRepository.create(depositEntity.deposit, {
      session,
    });
  }
}
