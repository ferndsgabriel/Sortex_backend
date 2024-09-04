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
exports.CriarProdutoServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const produtoSchema_1 = require("../schemas/produtoSchema");
const admSchema_1 = require("../schemas/admSchema");
class CriarProdutoServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, description, photos, id }) {
            if (!name || !description || !id) {
                throw new Error('Digite todos os campos.');
            } // verifico se recebo itens
            if (name.length < 2) {
                throw new Error("Digite um nome válido.");
            } // n quero um produto com apenas 2 caracteres no nome
            if (photos.length < 1) {
                throw new Error('Envie pelo menos uma foto do produto');
            } // tem que ter pelo menos uma foto
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema); //inicio o model de adm, pois produto tem adm como chave secundaria
            const obterAdm = yield admModel.findById(id); // verifico se tenho o adm
            if (!obterAdm) {
                throw new Error('Administrador não encontrado');
            } // se n tiver o adm
            const produtoModel = mongoose_1.default.model("Produtos", produtoSchema_1.produtoSchema); //inicio o model de produtos
            const criarProduto = new produtoModel({
                name,
                description,
                photos,
                admRef: id
            }); // passou por tudo posso criar o produto
            const response = yield criarProduto.save().catch(() => {
                throw new Error('Administrador não encontrado');
            });
            return response;
        });
    }
}
exports.CriarProdutoServices = CriarProdutoServices;
