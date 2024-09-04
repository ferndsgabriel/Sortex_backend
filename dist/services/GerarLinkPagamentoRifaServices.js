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
const obterLinkPagamento_1 = __importDefault(require("../mercadopago/obterLinkPagamento"));
const sorteioShema_1 = require("../schemas/sorteioShema");
const cartaoSchema_1 = require("../schemas/cartaoSchema");
const atualizarAcessToken_1 = __importDefault(require("../mercadopago/atualizarAcessToken"));
class GerarLinkPagamentoRifaServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sorteioId, email, name, whatsapp, qtd }) {
            if (!sorteioId || !email || !name || !whatsapp || qtd <= 0) {
                throw new Error('Preencha todos os campos');
            } // verifico se estou recebendo todos os parametros
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema); // crio uma model de sorteios
            const procurarSorteio = yield sorteioModel.findById(sorteioId); // procuro o sorteio pelo id
            if (!procurarSorteio) {
                throw new Error('Sorteio não encontrado.');
            } // se eu n encontrar
            if (procurarSorteio.drawn === false) {
                throw new Error("Sorteio encerrado");
            } // se o sorteio já estiver encerrado, não posso mais pagar
            if (procurarSorteio.status === false) {
                throw new Error("Venda de rifas encerrada");
            } // se a venda de rifas já estiver encerradas
            const cardModel = mongoose_1.default.model('Cartaos', cartaoSchema_1.cardSchema); // crio um model de cards
            const procurarCard = yield cardModel.findOne({ admRef: procurarSorteio.admRef }); // procuro qual deles possui o id do adm
            // que está vinculado aquele sorteio
            if (!procurarCard) {
                throw new Error('Cartão não encontrado');
            } // se n acho nenhum card
            const descricao = `Pagamento da rifa: ${procurarSorteio.title}; Quantidades: ${qtd}`; // pego uma descrição para colocar no pagamento
            const preco = procurarSorteio.price; // pego p preco da rifa para colocar no pagamento
            const accessToken = procurarCard.accessToken.toString(); // pego o acess token do card
            const refreshToken = procurarCard.refreshToken.toString(); // pego o refresh token tbm, talvez possa ser usado
            let response; // crio um let de response, pois pode sofrer alterações
            try {
                response = yield (0, obterLinkPagamento_1.default)({
                    accessToken: accessToken,
                    amount: preco,
                    description: descricao,
                    user: { name, email, whatsapp },
                    sorteioId,
                    qtd
                }); // primeiro, tento obter a resposta usando os dados atuais, se n consigo...
            }
            catch (error) {
                if (error === 'unauthorized') { //se n conseguir pode ser o acess token desatualizado...
                    try {
                        const refreshResponse = yield (0, atualizarAcessToken_1.default)(refreshToken, accessToken); // se for isso, chamo a função de atualizar o acess token
                        const newAccessToken = refreshResponse.accesstoken; // obtenho o novo acessToken
                        const newRefreshToken = refreshResponse.refreshToken; // o novo refresh
                        if (newAccessToken && newAccessToken) { // verifico se estou de fato recebendo os novos tokens
                            yield cardModel.updateOne({ admRef: procurarSorteio.admRef, accessToken: accessToken }, { $set: { accessToken: newAccessToken, refreshToken: newRefreshToken } }); // atualizo no db
                        }
                        else {
                            throw new Error('Erro ao atualizar acess token'); // se n recebo esses novos acess token, retorno um erro
                        }
                        response = yield (0, obterLinkPagamento_1.default)({
                            accessToken: newAccessToken,
                            amount: preco,
                            description: descricao,
                            user: { name, email, whatsapp },
                            sorteioId,
                            qtd
                        }); // agora tento gerar um novo link através desse novo acess token
                    }
                    catch (refreshError) {
                        throw new Error(refreshError);
                    }
                }
                else {
                    throw new Error('Erro ao gerar link de pagamento');
                    // se n for isso é outro erro de pagamento
                }
            }
            const { id, status } = response; // pego o id do pagamento e o status na responsa do tokken
            if (!id || !status) {
                throw new Error("Erro ao gerar link de pagamento, envie todos os dados.");
            } // verifico se realmente pego esses dados
            const newPush = {
                id,
                status,
                user: { email, whatsapp, name }
            }; // crio um obj com informações do user e do pagamento
            for (let x = 0; x != qtd + 1; x++) {
                yield sorteioModel.findByIdAndUpdate(sorteioId, { $push: { rifas: newPush } }, { new: true }).catch((error) => {
                    throw new Error('Erro ao atualizar rifas no banco de dados');
                }); // faço um for para adicionar a rifa a qtd de rifas compradas
            }
            return response; // retorno a resposta
        });
    }
}
exports.GerarLinkPagamentoRifaServices = GerarLinkPagamentoRifaServices;
