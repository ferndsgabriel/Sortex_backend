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
exports.LogarAdmServives = void 0;
const bcryptjs_1 = require("bcryptjs");
const admSchema_1 = require("../schemas/admSchema");
const mongoose_1 = __importDefault(require("mongoose"));
const formats_1 = require("../utils/formats");
const jsonwebtoken_1 = require("jsonwebtoken");
class LogarAdmServives {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sub, email }) {
            if (!sub || !email) {
                throw new Error("Erro ao logar"); // verifico se recebo todos os dados
            }
            const admModel = mongoose_1.default.model('Administrador', admSchema_1.admSchema); // obtenho uma referencia de admModel
            const emailFormatado = (0, formats_1.formatEmail)(email); // formato o email
            const emailExiste = yield admModel.findOne(// verifico se este email existe no meu banco
            { email: emailFormatado });
            if (!emailExiste) {
                throw new Error("Erro ao logar"); //se n existir n posso logar
            }
            const compararSenha = yield (0, bcryptjs_1.compare)(sub, emailExiste.sub); // comparo o sub recebido com o sub que existe na linha onde peguei meu email
            if (!compararSenha) {
                throw new Error("Erro ao logar"); // se n são iguais eu n posso logar
            }
            const ujwtSegredo = process.env.UJWT_ADM; // obtenho o segredo no env
            if (!ujwtSegredo) {
                throw new Error("Erro ao logar"); // se n tenho o segredo n posso logar
            }
            const token = (0, jsonwebtoken_1.sign)(// gero um token passando os dados 
            {
                email: emailFormatado,
            }, ujwtSegredo, {
                subject: emailExiste._id.toString(),
                expiresIn: "30d",
            });
            return { token: token }; // retorno esse token 
        });
    }
}
exports.LogarAdmServives = LogarAdmServives;
