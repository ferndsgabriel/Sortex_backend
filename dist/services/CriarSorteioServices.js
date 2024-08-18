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
exports.CriarSorteioServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const cartaoSchema_1 = require("../schemas/cartaoSchema");
const produtoSchema_1 = require("../schemas/produtoSchema");
const sorteioShema_1 = require("../schemas/sorteioShema");
class CriarSorteioServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, productId, dataInicio, dataTermino, price, title }) {
            if (!id || !productId || !dataInicio || !dataTermino || !price || !title) {
                throw new Error('Digite todos os campos');
            } // verifico se todos os campos necessarios estão sendo enviados
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema); // obtendo adm model
            const procurarAdm = yield admModel.findById(id); // obtendo adm pelo id
            if (!procurarAdm) {
                throw new Error('Administrador não encontrado'); // se n tiver o adm...
            }
            const cardModel = mongoose_1.default.model('Cartaos', cartaoSchema_1.cardSchema); // card model;
            const pegandoCartao = yield cardModel.findOne({ admRef: id }); // pegando o card do adm
            if (!pegandoCartao) {
                throw new Error('Cartão não encontrado');
            } // se n encontrar o cartão
            const produtoModel = mongoose_1.default.model('Produtos', produtoSchema_1.produtoSchema); // model do produto
            const pegandoProduto = yield produtoModel.findById(productId); // procurando o produto pelo seu id
            if (!pegandoProduto) {
                throw new Error('Produto não encontrado');
            } // se n achar o produto...
            const onDay = new Date(); // pegando a data atual
            if (new Date(dataInicio) < onDay) {
                throw new Error('A data de início não pode ser menor que o dia atual');
            } // verifico se a data de início não é menor que o dia atual
            const tempoMaxStart = new Date(); // crio uma variavel para setar o tempo maximo que um sorteio pode começar
            tempoMaxStart.setMonth(onDay.getMonth() + 1); // falo que o periodo limite é de 1 mes
            if (new Date(dataInicio) > tempoMaxStart) {
                throw new Error('O início do período deve ser no máximo até um mês a partir de hoje.');
            } // verifico se está respeitando esse limite
            if (new Date(dataInicio) > new Date(dataTermino)) {
                throw new Error('A data de término deve ser maior que a data de início');
            } // n deixo a data de término ser menor que o período de início
            const sorteioModel = mongoose_1.default.model('Sorteio', sorteioShema_1.sorteioSchema); // obtendo o model do sorteio
            const newSorteio = new sorteioModel({
                admRef: id,
                produtoRef: pegandoProduto._id,
                cartaoRef: pegandoCartao._id,
                dataInicio,
                dataTermino,
                price,
                title,
            });
            yield newSorteio.save();
            return (newSorteio);
        });
    }
}
exports.CriarSorteioServices = CriarSorteioServices;
