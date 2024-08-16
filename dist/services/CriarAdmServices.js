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
exports.CriarAdmServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = require("bcryptjs");
require("dotenv/config");
const formats_1 = require("../utils/formats");
const admSchema_1 = require("../schemas/admSchema");
// Classe para criar adm
class CriarAdmServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, photo, sub }) {
            if (!name || !email || !photo || !sub) {
                throw new Error('Preencha todos os campos.');
            } // n pode enviar nada vazio
            if (name.length <= 3) {
                throw new Error('Digite um nome válido');
            } // nome precisa de pelo menos 3 caracteres
            const hashsub = yield (0, bcryptjs_1.hash)(sub, 8); // cria um hash do sub
            const AdmModel = mongoose_1.default.model('Administrador', admSchema_1.admSchema); // agora posso fazer operações na tabela adm
            const emailformatado = (0, formats_1.formatEmail)(email); //formatar o emailremovendo espaços e uppercase
            const emailExiste = yield AdmModel.findOne({ email: emailformatado }); // verifico se o email está em uso
            if (emailExiste) {
                throw new Error('Email indisponível');
            } // se tiver um email igual retorno um erro
            // Cria um novo usuário
            const criarAdm = new AdmModel({
                name,
                email: emailformatado,
                photo,
                sub: hashsub,
            });
            yield criarAdm.save(); // executo a função
            return { ok: true };
        });
    }
}
exports.CriarAdmServices = CriarAdmServices;
