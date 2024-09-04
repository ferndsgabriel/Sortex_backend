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
exports.AlterarSenhaServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
class AlterarSenhaServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, senhaAntiga, senhaNova }) {
            if (!(id || senhaAntiga || senhaNova)) {
                throw new Error("Preencha todos os campos");
            }
            const admModel = mongoose_1.default.model("Administradores", admSchema_1.admSchema);
            const procurarAdm = yield admModel.findById(id);
            if (!procurarAdm) {
                throw new Error('Administrador não encontrado');
            }
            const compararSenha = yield (0, bcryptjs_1.compare)(senhaAntiga, procurarAdm.password);
            const igual = yield (0, bcryptjs_1.compare)(senhaNova, procurarAdm.password);
            if (igual) {
                throw new Error('Digite uma senha diferente da atual');
            }
            if (!compararSenha) {
                throw new Error("Senha inválida");
            }
            const hashNewSenha = yield (0, bcryptjs_1.hash)(senhaNova, 8);
            const newUid = (0, crypto_1.randomUUID)();
            yield admModel.findByIdAndUpdate(id, { $set: { password: hashNewSenha, sessionToken: newUid } }).catch((error) => {
                console.log(error);
                throw new Error('Erro ao alterar senha');
            });
            return newUid;
        });
    }
}
exports.AlterarSenhaServices = AlterarSenhaServices;
