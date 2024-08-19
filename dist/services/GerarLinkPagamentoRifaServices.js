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
exports.GerarLinkPagamentoRifaServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gerarLinkPagamento_1 = __importDefault(require("../mercadopago/gerarLinkPagamento"));
const sorteioShema_1 = require("../schemas/sorteioShema");
const cartaoSchema_1 = require("../schemas/cartaoSchema");
class GerarLinkPagamentoRifaServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sorteioId, metodoDePagamento, email, name, whatsapp }) {
            if (!sorteioId || !metodoDePagamento || !email || !name || !whatsapp) {
                throw new Error('Preencha todos os campos'); // garantir que o user vai enviar todos os dados
            }
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema); //crio um model de sorteio
            const procurarSorteio = yield sorteioModel.findById(sorteioId); // procuro o sorteio 
            if (!procurarSorteio) {
                throw new Error('Sorteio não encontrado.'); // se não achar o sorteio
            }
            if (procurarSorteio.status === false) {
                throw new Error("Este sorteio já se encerrou");
            }
            const cardModel = mongoose_1.default.model('Cartaos', cartaoSchema_1.cardSchema); //crio um model de cards
            const procurarCard = yield cardModel.findOne({ admRef: procurarSorteio.admRef }); // procuro o cartão
            if (!procurarCard) {
                throw new Error('Cartão não encontrado'); // se não achar
            }
            const descricao = `Pagamento da rifa: ${procurarSorteio.title}`; // obtenho a descrição do sorteio
            const preco = procurarSorteio.price; // o preço da rifa
            const accessToken = procurarCard.accessToken; // access token para direcionar o pagamento
            // Chama a função processPayment com os parâmetros corretos
            const user = {
                name: name,
                email: email,
                whatsapp: whatsapp
            };
            const response = yield (0, gerarLinkPagamento_1.default)({ accessToken: 'APP_USR-3875468438633898-081711-c309e7f4bcf3481cac8562b69a9869b4-247395576',
                amount: preco,
                description: descricao,
                user: user,
                method: metodoDePagamento,
                sorteioId: sorteioId
            });
            const id = response.id;
            const status = response.status;
            const newPush = {
                id: id,
                status: status,
                user: {
                    email: email,
                    whatsapp: whatsapp,
                    name: name
                }
            };
            yield sorteioModel.findByIdAndUpdate(sorteioId, { $push: { rifas: newPush } }, { new: true }).catch((error) => {
                return (error);
            });
            return response;
        });
    }
}
exports.GerarLinkPagamentoRifaServices = GerarLinkPagamentoRifaServices;
