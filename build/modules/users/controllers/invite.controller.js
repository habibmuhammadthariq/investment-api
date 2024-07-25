import { validate } from "../request/invite.request.js";
import { InviteUserService } from "../services/invite.service.js";
import { db } from "../../../database/database.js";
import Mailer from "../../../services/mailer/index.js";
export const invite = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        validate(req.body);
        const inviteUserService = new InviteUserService(db);
        const result = await inviteUserService.handle(req.body, { session });
        const message = {
            to: result.email,
            subject: "Verification Account",
            template: "users/email/email-verification",
            context: {
                name: req.body.name,
                verificationLink: result.emailVerificaitonCode,
            },
        };
        await Mailer.send(message);
        await db.commitTransaction();
        res.status(201).json({
            _id: result._id,
        });
    }
    catch (error) {
        await db.abortTransaction();
        next(error);
    }
    finally {
        await db.endSession();
    }
};
