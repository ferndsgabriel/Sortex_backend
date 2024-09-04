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
exports.EditarProdutosServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const produtoSchema_1 = require("../schemas/produtoSchema");
class EditarProdutosServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, photos, name, description, oldPhotos }) {
            if (!id) {
                throw new Error('Preencha todos os campos');
            }
            const produtoModel = mongoose_1.default.model('Produtos', produtoSchema_1.produtoSchema);
            const procurarProduto = yield produtoModel.findById(id);
            if (!procurarProduto) {
                throw new Error('Produto não encontrado');
            }
            const sendPhotos = photos.concat(oldPhotos);
            yield produtoModel.findByIdAndUpdate(id, {
                $set: {
                    name: name,
                    description: description,
                    photos: sendPhotos
                }
            }).catch((error) => {
                throw new Error("Erro ao atualizar produto");
            });
            return { ok: true };
        });
    }
}
exports.EditarProdutosServices = EditarProdutosServices;
