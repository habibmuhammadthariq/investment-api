import fs from "fs";
import inlineCss from "@point-hub/nodemailer-inlinecss";
import { createTransport, createTestAccount, getTestMessageUrl } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import mg from "nodemailer-mailgun-transport";
import { mailConfig, mailgunConfig } from "../../config/mail.js";
import { copyrightYear, appName } from "../../services/mailer/resources/handlebarsHelpers.js";
class Mailer {
    async init() {
        if (process.env.NODE_ENV !== "production") {
            await this.setupDevelopmentAccount();
        }
        else {
            this.setupMailgunAccount();
        }
        this.setupPlugins();
        return this;
    }
    async send(data) {
        data.from = `${mailConfig.fromName} <${mailConfig.fromAddress}>`;
        const info = await this.transporter.sendMail(data);
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        if (process.env.NODE_ENV !== "production") {
            console.log("Preview URL: %s", getTestMessageUrl(info));
        }
    }
    async setupDevelopmentAccount() {
        const testAccount = await createTestAccount();
        this.transporter = createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    setupMailgunAccount() {
        this.transporter = createTransport(mg({
            auth: {
                api_key: mailgunConfig.apiKey,
                domain: mailgunConfig.domain,
            },
        }));
    }
    setupPlugins() {
        // Add Nodemailer Handlebars Plugin
        this.transporter.use("compile", hbs({
            viewEngine: {
                layoutsDir: "./src/services/mailer/resources",
                partialsDir: "./src/services/mailer/resources",
                helpers: { copyrightYear, appName },
                extname: ".hbs",
            },
            viewPath: "./src/modules",
            extName: ".hbs",
        }));
        // Add Nodemailer Inlinecss Plugin
        this.transporter.use("compile", inlineCss({
            extraCss: fs.readFileSync("./src/services/mailer/resources/styles.css").toString(),
        }));
    }
}
export default await new Mailer().init();
