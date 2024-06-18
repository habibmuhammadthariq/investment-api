import DatabaseConnection, {
  DocumentInterface,
} from "@src/database/connection.js";
import {
  DepositCashbackPaymentInterface,
  DepositInterface,
} from "@src/modules/deposits/entities/deposit.entitiy.js";
import { DepositRepository } from "@src/modules/deposits/repositories/deposit.repository.js";
import { ObjectId } from "mongodb";

export class RealisedInterestService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const depositRepository = new DepositRepository(this.db);

    if (doc._id) {
      doc.updatedAt = new Date().toISOString();
      doc.updatedBy = doc.user;
      doc._id = new ObjectId(doc._id);
    } else {
      doc.createdAt = new Date().toISOString();
      doc.createdBy = doc.user;
      doc._id = new ObjectId();
    }

    delete doc.user;

    let totalRemaining = 0;
    for (const interest of doc.interests) {
      totalRemaining += Number(interest.net);
    }
    for (const interest of doc.interests) {
      interest.net = Number(interest.net);
      interest.received = Number(interest.received);
      totalRemaining = Number(totalRemaining) - Number(interest.received);
      if (interest.corrections) {
        for (const correction of interest.corrections) {
          totalRemaining = Number(totalRemaining) - Number(correction.received);
        }
      }
    }

    if (totalRemaining == 0) {
      doc.status = "complete";
    } else {
      doc.status = "incomplete";
    }

    await depositRepository.update(
      id,
      {
        $set: {
          interestPayment: doc,
        },
      },
      {
        session,
        xraw: true,
      }
    );
  }
}
