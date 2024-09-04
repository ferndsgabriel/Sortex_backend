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
exports.DesvincularContaMPServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartaoSchema_1 = require("../schemas/cartaoSchema");
const sorteioShema_1 = require("../schemas/sorteioShema");
class DesvincularContaMPServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Id não enviado');
            }
            const cardsModel = mongoose_1.default.model('Cartaos', cartaoSchema_1.cardSchema);
            const procurarConta = yield cardsModel.findOne({ admRef: id });
            if (!procurarConta) {
                throw new Error('Erro ao desvincular conta');
            }
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema);
            const procurarSorteioAberto = yield sorteioModel.findOne({ admRef: id, status: false, drawn: false });
            if (procurarSorteioAberto) {
                throw new Error('Um sorteio vinculado a essa conta esta em andamento');
            }
            yield cardsModel.findOneAndDelete({ admRef: id }).catch(() => {
                throw new Error("Erro ao desvincular conta");
            });
            return { ok: true };
        });
    }
}
exports.DesvincularContaMPServices = DesvincularContaMPServices;
