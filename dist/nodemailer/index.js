"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = SendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function SendEmail(email, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const formatEmail = email.toLowerCase().trim();
        const user = process.env.NODEMAILER_EMAIL;
        const pass = process.env.NODEMAILER_PASS;
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            secure: false,
            port: 587,
            auth: { user, pass },
        });
        try {
            // Verifica a conexão com o servidor
            yield new Promise((resolve, reject) => {
                transporter.verify(function (error, success) {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    else {
                        console.log("Server is ready to take our messages");
                        return resolve();
                    }
                });
            });
            // Envia o email
            yield new Promise((resolve, reject) => {
                transporter.sendMail({
                    from: user,
                    to: formatEmail,
                    subject: "Email de sortex",
                    html: message,
                }, (error, info) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    else {
                        console.log("sucess", info);
                        return resolve();
                    }
                });
            });
            return { ok: true };
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email");
        }
    });
}
