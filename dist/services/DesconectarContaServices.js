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
exports.DesconectarContaServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const crypto_1 = require("crypto");
class DesconectarContaServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error("Id não enviado");
            }
            const admModel = mongoose_1.default.model("Administradores", admSchema_1.admSchema);
            const procurarAdm = yield admModel.findById(id);
            if (!procurarAdm) {
                throw new Error("Administrador não encontrado");
            }
            const newUid = (0, crypto_1.randomUUID)();
            const atualizarSession = yield admModel.findByIdAndUpdate(id, { $set: { sessionToken: newUid } }).catch((error) => {
                throw new Error('Erro ao atualizar session token');
            });
            return newUid;
        });
    }
}
exports.DesconectarContaServices = DesconectarContaServices;
