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
const axiosSaller_1 = __importDefault(require("../mercadopago/axiosSaller"));
class GerarLinkPagamentoRifaServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sorteioId, metodoDePagamento, email, name, whatsapp, qtd }) {
            if (!sorteioId || !metodoDePagamento || !email || !name || !whatsapp || qtd <= 0) {
                throw new Error('Preencha todos os campos'); // garantir que o user vai enviar todos os dados
            }
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema); //crio um model de sorteio
            const procurarSorteio = yield sorteioModel.findById(sorteioId); // procuro o sorteio 
            if (!procurarSorteio) {
                throw new Error('Sorteio não encontrado.'); // se não achar o sorteio
            }
            if (procurarSorteio.status === false) {
                throw new Error("Este sorteio já se encerrou");
            } // se o status estiver como false, significa que o sorteio já encerrou
            const cardModel = mongoose_1.default.model('Cartaos', cartaoSchema_1.cardSchema); //crio um model de cards
            const procurarCard = yield cardModel.findOne({ admRef: procurarSorteio.admRef }); // procuro o cartão
            if (!procurarCard) {
                throw new Error('Cartão não encontrado'); // se não achar
            }
            if (qtd < 1) {
                throw new Error("Digite uma quantidade maior que zero");
            } // a qtd de rifas precisa ser maior que 0
            const descricao = `Pagamento da rifa: ${procurarSorteio.title}`; // obtenho a descrição do sorteio
            const preco = procurarSorteio.price; // o preço da rifa
            const authCode = procurarCard.authCode.toString(); // access token para direcionar o pagamento
            const accessToken = yield (0, axiosSaller_1.default)(authCode).then();
            //chamo o axios para gerar o acess token atraves do auth token
            // esse acesssToken é o responsavel por poder enviar pagamentos a conta do adm
            if (!accessToken) {
                throw new Error('Erro ao vincular conta de cobranças');
            } // se eu n tenho um token...
            const user = {
                name: name,
                email: email,
                whatsapp: whatsapp
            };
            const response = yield (0, gerarLinkPagamento_1.default)({ accessToken,
                amount: preco,
                description: descricao,
                user: user,
                method: metodoDePagamento,
                sorteioId: sorteioId,
                qtd: qtd
            }); // gero link de pagamento enviando os dados necessarios
            const id = response.id; // obtenho o id da transação 
            const status = response.status; // status da transação
            if (!id || !status) {
                throw new Error("Erro ao gerar link de pagamento");
            } // se n tiver id ou status, retorno um erro
            const newPush = {
                id: id,
                status: status,
                user: {
                    email: email,
                    whatsapp: whatsapp,
                    name: name
                }
            }; // formato como os arquivos vão ser enviados;
            for (let x = 0; x < qtd; x++) {
                yield sorteioModel.findByIdAndUpdate(sorteioId, { $push: { rifas: newPush } }, { new: true }).catch((error) => {
                    return (error);
                });
            }
            ; // faço um loop para gerar no db a qtd de rifas que ele comprou 
            return response; // retorno o link
        });
    }
}
exports.GerarLinkPagamentoRifaServices = GerarLinkPagamentoRifaServices;
