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
exports.FinalizarSorteioServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sorteioShema_1 = require("../schemas/sorteioShema");
const axiosPayment_1 = __importDefault(require("../mercadopago/axiosPayment"));
class FinalizarSorteioServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Id não enviado');
            } //
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema);
            const procurarSorteio = yield sorteioModel.findById(id).exec();
            if (!procurarSorteio) {
                throw new Error('Sorteio não encontrado');
            }
            let aprovados = [];
            const analisar = procurarSorteio.rifas.map((item) => __awaiter(this, void 0, void 0, function* () {
                const id = item.id.toString();
                const response = yield (0, axiosPayment_1.default)(id);
                const status = response.data.status;
                console.log(status);
                if (status === 'approved') {
                    const pushUser = {
                        id: item.id,
                        user: item.user,
                        status: 'approved'
                    };
                    aprovados.push(pushUser);
                }
            }));
            // Aguardando todas as Promises serem resolvidas
            yield Promise.all(analisar);
            yield sorteioModel.updateOne({ _id: id }, { $set: { rifas: aprovados, status: false } }).then(() => {
                console.log(aprovados);
                return aprovados;
            }).catch((error) => {
                console.log(error);
                return error;
            });
        });
    }
}
exports.FinalizarSorteioServices = FinalizarSorteioServices;
