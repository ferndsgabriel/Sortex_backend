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
exports.EnviarLinkRecuperacaoServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const crypto_1 = require("crypto");
const recoverySchema_1 = require("../schemas/recoverySchema");
const nodemailer_1 = require("../nodemailer");
require("dotenv/config");
class EnviarLinkRecuperacaoServices {
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw new Error("Digite seu e-mail");
            }
            const formatEmail = email.toLowerCase().trim();
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema);
            const procurarAdm = yield admModel.findOne({ email: formatEmail });
            if (!procurarAdm) {
                throw new Error("E-mail não encontrado");
            }
            const uid = (0, crypto_1.randomUUID)();
            const cod = uid.split('-')[0];
            const period = new Date();
            const recoveryModel = mongoose_1.default.model('Codigos', recoverySchema_1.recoverySchema);
            const procurarRecovery = yield recoveryModel.findOne({ admRef: procurarAdm._id });
            if (!procurarRecovery) {
                const createCod = new recoveryModel({
                    cod: cod,
                    admRef: procurarAdm._id,
                    period: period
                });
                yield createCod.save();
            }
            else {
                yield recoveryModel.updateOne({ admRef: procurarAdm._id }, { $set: { cod: cod, period: period } });
            }
            const link = encodeURI(`${process.env.FRONT_URL}/recovery/${cod}/${procurarAdm._id}`);
            const message = `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Olá, ${procurarAdm.name}</p><br>
            <p>🔐 Recebemos uma solicitação de recuperação de conta para o Sortex.</p>
    
            <p><strong>${link}</strong></p><br>

            <p>Este link é válido por um curto período de tempo. Não compartilhe com ninguém.</p><br>
            <p>Se você não solicitou essa recuperação ou tiver qualquer dúvida, entre em contato conosco.</p><br>

            <p>Atenciosamente,<br>
            Equipe de Suporte do Sortex 🌟</p>
        </div>
        `;
            try {
                yield (0, nodemailer_1.SendEmail)(formatEmail, message);
                return { ok: true };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.EnviarLinkRecuperacaoServices = EnviarLinkRecuperacaoServices;
