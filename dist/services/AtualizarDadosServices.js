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
exports.AtualizarDadosServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const bcryptjs_1 = require("bcryptjs");
class AtualizarDadosServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sub, email, name, photo, id }) {
            if (!(sub || email || name || photo || id)) {
                throw new Error("Preencha todos os campos");
            }
            const admModel = mongoose_1.default.model("Administradores", admSchema_1.admSchema);
            const procurarAdm = yield admModel.findById(id);
            if (!procurarAdm) {
                throw new Error('Administrador não encontrado');
            }
            const compararSub = yield (0, bcryptjs_1.compare)(sub, procurarAdm.sub);
            if (!compararSub) {
                throw new Error("Conta inválida");
            }
            const formatEmail = email.toLowerCase().trim();
            if (formatEmail !== procurarAdm.email) {
                throw new Error("Conta inválida");
            }
            yield admModel.findByIdAndUpdate(id, { $set: { name: name, photo: photo } });
            return { ok: true };
        });
    }
}
exports.AtualizarDadosServices = AtualizarDadosServices;
