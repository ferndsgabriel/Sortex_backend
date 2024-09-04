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
exports.DeletarProdutoServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const produtoSchema_1 = require("../schemas/produtoSchema");
const FirebaseMiddlewara_1 = require("../middlewares/FirebaseMiddlewara");
class DeletarProdutoServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Id não encontrado');
            }
            const produtoModel = mongoose_1.default.model('Produtos', produtoSchema_1.produtoSchema);
            const procurarProduto = yield produtoModel.findById(id);
            if (!procurarProduto) {
                throw new Error('Produto não encontrado');
            }
            const deletePromises = procurarProduto.photos.map(item => (0, FirebaseMiddlewara_1.DeleteImage)(item)
                .then(() => {
                console.log(`Foto deletada com sucesso: ${item}`);
            })
                .catch(error => {
                console.error(`Erro ao deletar foto: ${item}`, error);
            }));
            yield Promise.all(deletePromises);
            yield produtoModel.findByIdAndDelete(id).catch(() => {
                throw new Error("Erro ao deletar");
            });
            return { ok: true };
        });
    }
}
exports.DeletarProdutoServices = DeletarProdutoServices;
