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
exports.EncerrarSorteioServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sorteioShema_1 = require("../schemas/sorteioShema");
class EncerrarSorteioServices {
    execute(sorteioId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sorteioId) {
                throw new Error('Digite o id do sorteio');
            }
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema);
            const procurarSorteio = yield sorteioModel.findById(sorteioId);
            if (!procurarSorteio) {
                throw new Error('Sorteio não encontrado');
            }
            if (procurarSorteio.status) {
                throw new Error('Finalize primeiro as rifas');
            }
            const finalizarSorteio = sorteioModel.findByIdAndUpdate(sorteioId, { $set: { drawn: false, status: false } }).catch((error) => {
                console.log(finalizarSorteio);
                throw new Error("Erro ao finalizar sorteio");
            });
            return 'Sorteio finalizado com sucesso porra';
        });
    }
}
exports.EncerrarSorteioServices = EncerrarSorteioServices;
