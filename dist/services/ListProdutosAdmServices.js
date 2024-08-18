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
exports.ListProdutosAdmServices = void 0;
const produtoSchema_1 = require("../schemas/produtoSchema");
const mongoose_1 = __importDefault(require("mongoose"));
class ListProdutosAdmServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Envie um id');
            } // mando um erro se n tiver um id
            const produtosModel = mongoose_1.default.model('Produtos', produtoSchema_1.produtoSchema); //obtenho a model de produtos
            const findAll = produtosModel.find({ admRef: id }).sort({ name: 1 }); // busco todos os produtos que tenho o adm como ref
            return findAll; //retorno todos os produtos
        });
    }
}
exports.ListProdutosAdmServices = ListProdutosAdmServices;
