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
exports.routes = void 0;
// imports funcionamento
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
//middlewares imports
const AdmMiddleware_1 = __importDefault(require("./middlewares/AdmMiddleware"));
const FirebaseMiddlewara_1 = __importDefault(require("./middlewares/FirebaseMiddlewara"));
//imports controlles
const mongo_1 = require("./mongo");
const CriarAdmController_1 = require("./controllers/CriarAdmController");
const LogarAdmController_1 = require("./controllers/LogarAdmController");
const DetalhesAdmController_1 = require("./controllers/DetalhesAdmController");
const CriarProdutoController_1 = require("./controllers/CriarProdutoController");
const GerarLinkSallerController_1 = require("./controllers/GerarLinkSallerController");
const ListProdutosAdmController_1 = require("./controllers/ListProdutosAdmController");
const CriarSorteioController_1 = require("./controllers/CriarSorteioController");
const GerarLinkPagamentoRifaController_1 = require("./controllers/GerarLinkPagamentoRifaController");
const FinalizarSorteioController_1 = require("./controllers/FinalizarSorteioController");
const SortearProdutoController_1 = require("./controllers/SortearProdutoController");
//imports pagamento callback
const getSaller_1 = require("./mercadopago/getSaller");
const verificarPagamento_1 = require("./mercadopago/verificarPagamento");
const Multer = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // multer para upload de arquivos
exports.routes = (0, express_1.Router)(); // importando para poder utilizar no App;
// criando as rotas
exports.routes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = new Date();
        console.log('Endpoint ativo');
        return res.send({
            Data: data,
            Status: "Ativo"
        });
    }
    catch (error) {
        return res.status(500).send('Erro ao conectar no servidor.');
    }
}));
exports.routes.get('/mongo', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongo_1.connection;
        return res.send({
            Resultado: "Sucesso ao conectar com o banco mongodb"
        });
    }
    catch (error) {
        next(error); // Passa o erro para o middleware de tratamento de erros
    }
}));
//endpoints rotas de paginas
exports.routes.post('/adm', new CriarAdmController_1.CriarAdmController().handle); // cadastrar
exports.routes.post('/authadm', new LogarAdmController_1.LogarAdmController().handle); // logar
exports.routes.get('/adm', AdmMiddleware_1.default, new DetalhesAdmController_1.DetalhesAdmController().handle); // logar
exports.routes.post('/product', AdmMiddleware_1.default, Multer.array('files'), FirebaseMiddlewara_1.default, new CriarProdutoController_1.CriarProdutoController().handle); // criar produto
exports.routes.get('/linksaller', AdmMiddleware_1.default, new GerarLinkSallerController_1.GerarLinkSallerController().handle);
exports.routes.get('/products', AdmMiddleware_1.default, new ListProdutosAdmController_1.ListProdutosAdmController().handle);
exports.routes.post('/sortex', AdmMiddleware_1.default, new CriarSorteioController_1.CriarSorteioController().handle);
exports.routes.post('/payment', new GerarLinkPagamentoRifaController_1.GerarLinkPagamentoRifaController().handle);
exports.routes.put('/finalizar', AdmMiddleware_1.default, new FinalizarSorteioController_1.FinalizarSorteioController().handle);
exports.routes.put('/sortear', AdmMiddleware_1.default, new SortearProdutoController_1.SortearProdutoController().handle);
//pagamento callback
exports.routes.get('/sallercallback', new getSaller_1.GetSaller().handle);
exports.routes.post('/paymentcallback', new verificarPagamento_1.VerificarPagamento().handle);
