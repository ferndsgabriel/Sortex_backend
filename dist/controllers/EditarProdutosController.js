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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditarProdutosController = void 0;
const EditarProdutosServices_1 = require("../services/EditarProdutosServices");
class EditarProdutosController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let photos = [];
            if (req.files && Array.isArray(req.files)) {
                //inicio um array vazio
                req.files.map((item) => {
                    photos.push(item.firebaseUrl);
                }); // intero os arquivos que tem no req.file e pego o firebaseUrl que é o endereço que minha foto que foi pro fb 
            } // verifico se estou recebendo um arquivo e se estou recebendo um array de arquivos
            const { name, description, oldPhotos } = req.body; // os outros itens vou receber no body da requisição
            const { id } = req.params;
            const editarProdutos = new EditarProdutosServices_1.EditarProdutosServices(); // instancio o service
            try {
                const response = yield editarProdutos.execute({
                    name, description, photos: photos, id, oldPhotos
                }); // faço um try e catch e retorno um sucesso ou erro
                return res.status(200).json(response);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.EditarProdutosController = EditarProdutosController;
