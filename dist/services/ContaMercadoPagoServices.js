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
exports.ContaMercadoPagoServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartaoSchema_1 = require("../schemas/cartaoSchema");
class ContaMercadoPagoServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Id não enviado');
            }
            const contaModel = mongoose_1.default.model('cartaos', cartaoSchema_1.cardSchema);
            const procurarConta = yield contaModel.findOne({ admRef: id });
            if (!procurarConta) {
                throw new Error("Cartão não vinculado");
            }
            return procurarConta._id;
        });
    }
}
exports.ContaMercadoPagoServices = ContaMercadoPagoServices;
