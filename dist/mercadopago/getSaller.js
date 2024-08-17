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
exports.GetSaller = void 0;
const axiosToken_1 = __importDefault(require("./axiosToken"));
const cartaoSchema_1 = require("../schemas/cartaoSchema");
const mongoose_1 = __importDefault(require("mongoose"));
class GetSaller {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // essa função está vinculado a rota sallercallback, que é o redirect do adm após logar em sua conta do mp para poder receber os pagamentos
            const authCode = req.query.code; // recebo o token da requisição 
            const stateId = req.query.state; // recebo o id do user 
            if (!authCode) {
                res.status(400).send('Código de autorização não encontrado.');
                return;
            } // se n tiver o token.... 
            if (!stateId) {
                res.status(400).send('Id não encontrado');
            } // se eu n receber o id...
            const accessToken = yield (0, axiosToken_1.default)(authCode).then();
            //chamo o axios para gerar o acess token atraves do auth token
            // esse acesssToken é o responsavel por poder enviar pagamentos a conta do adm
            if (!accessToken) {
                res.status(400).send('Erro ao vincular conta');
            } // se eu n tenho um token...
            const cardModel = mongoose_1.default.model('Cartao', cartaoSchema_1.cardSchema); // crio um model de card
            const obterModels = yield cardModel.find({ admRef: stateId }); // verifico se meu adm possui uma cartão
            if (obterModels.length > 0) {
                res.status(400).send('Você já possui uma conta vinculada');
            } // se ele tiver...
            const newCard = new cardModel({
                acessToken: accessToken,
                admRef: stateId
            }); // crio um novo card no db
            yield newCard.save();
            return res.status(201).send('Conta vinculada com sucesso.');
        });
    }
}
exports.GetSaller = GetSaller;
