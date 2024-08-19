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
exports.VerificarPagamento = void 0;
const axiosPayment_1 = __importDefault(require("./axiosPayment"));
const mongoose_1 = __importDefault(require("mongoose"));
const sorteioShema_1 = require("../schemas/sorteioShema");
class VerificarPagamento {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            const id = data.id.toString();
            try {
                const response = yield (0, axiosPayment_1.default)(id);
                const { status, metadata: { sorteio_id: sorteioId, user } } = response.data;
                const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema);
                // Buscar o sorteio
                const procurarSorteio = yield sorteioModel.findById(sorteioId).exec();
                if (!procurarSorteio) {
                    return res.status(400).json('Sorteio não encontrado');
                }
                // Verificar se rifas existe e é um array
                if (!Array.isArray(procurarSorteio.rifas)) {
                    return res.status(400).json('Rifas não é um array');
                }
                let updatedRifas = [];
                procurarSorteio.rifas.forEach((item) => {
                    if (item.id.toString() === id.toString()) {
                        const updateUser = {
                            id: item.id,
                            user: user,
                            status: status
                        };
                        updatedRifas.push(updateUser);
                    }
                    else {
                        updatedRifas.push(item);
                    }
                });
                yield sorteioModel.updateOne({ _id: sorteioId }, { $set: { rifas: updatedRifas } });
                console.log('Status da rifa atualizado com sucesso');
                res.status(200).json('Status da rifa atualizado com sucesso');
            }
            catch (error) {
                console.error(error.message);
                res.status(500).json({ error: 'Erro ao verificar o pagamento' });
            }
        });
    }
}
exports.VerificarPagamento = VerificarPagamento;
