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
exports.RecuperarSenhaServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const recoverySchema_1 = require("../schemas/recoverySchema");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
class RecuperarSenhaServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, cod, pass }) {
            if (!id || !cod || !pass) {
                throw new Error("Preencha todos os dados");
            }
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema);
            const procurarAdm = yield admModel.findById(id);
            if (!procurarAdm) {
                throw new Error("Administrador não encontrado");
            }
            const codigoModel = mongoose_1.default.model('Codigos', recoverySchema_1.recoverySchema);
            const procurarCodigo = yield codigoModel.findOne({ admRef: id });
            if (!procurarCodigo) {
                throw new Error("Código não encontrado");
            }
            if (cod !== procurarCodigo.cod) {
                throw new Error('Link inválido');
            }
            const onDay = new Date();
            onDay.setMinutes(onDay.getMinutes() - 20);
            if (onDay > procurarCodigo.period) {
                throw new Error('Link inválido');
            }
            const hashPass = yield (0, bcryptjs_1.hash)(pass, 8);
            const deletarCod = yield codigoModel.deleteOne({ admRef: id });
            const uid = (0, crypto_1.randomUUID)();
            const atualizarSenha = yield admModel.findByIdAndUpdate(id, { $set: { password: hashPass, sessionToken: uid } }).catch((error) => {
                console.log(error);
                throw new Error('Erro ao atualizar senha');
            });
            return { ok: true };
        });
    }
}
exports.RecuperarSenhaServices = RecuperarSenhaServices;
