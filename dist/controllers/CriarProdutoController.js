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
exports.CriarProdutoController = void 0;
const CriarProdutoServices_1 = require("../services/CriarProdutoServices");
class CriarProdutoController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.files || !Array.isArray(req.files)) {
                return res.status(400).json('Imagem não localizada!');
            } // verifico se estou recebendo um arquivo e se estou recebendo um array de arquivos
            let photos = []; //inicio um array vazio
            req.files.map((item) => {
                photos.push(item.firebaseUrl);
            }); // intero os arquivos que tem no req.file e pego o firebaseUrl que é o endereço que minha foto que foi pro fb 
            if (photos.length === 0) {
                return res.status(400).json('Imagem não localizada!');
            } // verifico se tenho pelo menos uma foto
            const { name, description, price } = req.body; // os outros itens vou receber no body da requisição
            const id = req.adm_id; //pego o id atraves da tipagem que gerei o request, que recebe o id através do sub do token 
            const criarProdutoServices = new CriarProdutoServices_1.CriarProdutoServices(); // instancio o service
            try {
                const response = yield criarProdutoServices.execute({
                    name, description, price, photos: photos, id
                }); // faço um try e catch e retorno um sucesso ou erro
                return res.status(201).json(response);
            }
            catch (error) {
                return res.status(400).json(error.message);
            }
        });
    }
}
exports.CriarProdutoController = CriarProdutoController;
