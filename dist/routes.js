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
//import no auth
const mongo_1 = require("./mongo");
const CriarAdmController_1 = require("./controllers/CriarAdmController");
const EnviarLinkRecuperacaoController_1 = require("./controllers/EnviarLinkRecuperacaoController");
const RecuperarSenhaController_1 = require("./controllers/RecuperarSenhaController");
const LogarAdmController_1 = require("./controllers/LogarAdmController");
const GerarLinkPagamentoRifaController_1 = require("./controllers/GerarLinkPagamentoRifaController");
const ProcurarCodRecuperacaoController_1 = require("./controllers/ProcurarCodRecuperacaoController");
// imports auth
const DetalhesAdmController_1 = require("./controllers/DetalhesAdmController");
const CriarProdutoController_1 = require("./controllers/CriarProdutoController");
const GerarLinkSallerController_1 = require("./controllers/GerarLinkSallerController");
const ListProdutosAdmController_1 = require("./controllers/ListProdutosAdmController");
const CriarSorteioController_1 = require("./controllers/CriarSorteioController");
const FinalizarRifasController_1 = require("./controllers/FinalizarRifasController");
const SortearProdutoController_1 = require("./controllers/SortearProdutoController");
const EncerrarSorteioController_1 = require("./controllers/EncerrarSorteioController");
const CriarSocialMediaController_1 = require("./controllers/CriarSocialMediaController");
const DeletarSocialMediaController_1 = require("./controllers/DeletarSocialMediaController");
const ListarRedesSociaisController_1 = require("./controllers/ListarRedesSociaisController");
const ContaMercadoPagoController_1 = require("./controllers/ContaMercadoPagoController");
const DesvincularContaMPController_1 = require("./controllers/DesvincularContaMPController");
const DesconectarContaController_1 = require("./controllers/DesconectarContaController");
const AlterarSenhaController_1 = require("./controllers/AlterarSenhaController");
const AtualizarDadosController_1 = require("./controllers/AtualizarDadosController");
const ProdutoDetalhesController_1 = require("./controllers/ProdutoDetalhesController");
const DeletarProdutoController_1 = require("./controllers/DeletarProdutoController");
const EditarProdutosController_1 = require("./controllers/EditarProdutosController");
const ListarSorteiosAtivosController_1 = require("./controllers/ListarSorteiosAtivosController");
const ListarSorteiosFinalizadosController_1 = require("./controllers/ListarSorteiosFinalizadosController");
const RifaDetalhesController_1 = require("./controllers/RifaDetalhesController");
//imports pagamento callback
const obterContaVendedor_1 = require("./mercadopago/obterContaVendedor");
const respostasPagamento_1 = require("./mercadopago/respostasPagamento");
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
// rotas sem autenticação
exports.routes.post('/adm', new CriarAdmController_1.CriarAdmController().handle); // cadastrar
exports.routes.post('/authadm', new LogarAdmController_1.LogarAdmController().handle); // logar
exports.routes.get('/raffle', new RifaDetalhesController_1.RifaDetalhesController().handle);
exports.routes.post('/pagamento', new GerarLinkPagamentoRifaController_1.GerarLinkPagamentoRifaController().handle);
exports.routes.post('/recovery', new EnviarLinkRecuperacaoController_1.EnviarLinkRecuperacaoController().handle);
exports.routes.put('/recovery', new RecuperarSenhaController_1.RecuperarSenhaController().handle);
exports.routes.get('/recovery', new ProcurarCodRecuperacaoController_1.ProcurarCodRecuperacaoController().handle);
// rotas com autenticação
exports.routes.get('/adm', AdmMiddleware_1.default, new DetalhesAdmController_1.DetalhesAdmController().handle); // logar
exports.routes.post('/produtos', AdmMiddleware_1.default, Multer.array('files'), FirebaseMiddlewara_1.default, new CriarProdutoController_1.CriarProdutoController().handle); // criar produto
exports.routes.put('/produto/:id', AdmMiddleware_1.default, Multer.array('files'), FirebaseMiddlewara_1.default, new EditarProdutosController_1.EditarProdutosController().handle); // editar produto
exports.routes.get('/linksaller', AdmMiddleware_1.default, new GerarLinkSallerController_1.GerarLinkSallerController().handle);
exports.routes.get('/produtos', AdmMiddleware_1.default, new ListProdutosAdmController_1.ListProdutosAdmController().handle);
exports.routes.get('/produto/:id', AdmMiddleware_1.default, new ProdutoDetalhesController_1.ProdutoDetalhesController().handle);
exports.routes.post('/sorteio', AdmMiddleware_1.default, new CriarSorteioController_1.CriarSorteioController().handle);
exports.routes.put('/finalizarrifas', AdmMiddleware_1.default, new FinalizarRifasController_1.FinalizarRifasController().handle);
exports.routes.put('/sortear', AdmMiddleware_1.default, new SortearProdutoController_1.SortearProdutoController().handle);
exports.routes.put('/finalizarsorteio', AdmMiddleware_1.default, new EncerrarSorteioController_1.EncerrarSorteioController().handle);
exports.routes.post('/sociais', AdmMiddleware_1.default, new CriarSocialMediaController_1.CriarSocialMediaController().handle);
exports.routes.delete('/sociais', AdmMiddleware_1.default, new DeletarSocialMediaController_1.DeletarSocialMediaController().handle);
exports.routes.get('/sociais', AdmMiddleware_1.default, new ListarRedesSociaisController_1.ListarRedesSociaisController().handle);
exports.routes.get('/sorteiosprogress', AdmMiddleware_1.default, new ListarSorteiosAtivosController_1.ListarSorteiosAtivosController().handle);
exports.routes.get('/sorteiosfinished', AdmMiddleware_1.default, new ListarSorteiosFinalizadosController_1.ListarSorteiosFinalizadosController().handle);
exports.routes.get('/account', AdmMiddleware_1.default, new ContaMercadoPagoController_1.ContaMercadoPagoController().handle);
exports.routes.delete('/account', AdmMiddleware_1.default, new DesvincularContaMPController_1.DesvincularContaMPController().handle);
exports.routes.put('/session', AdmMiddleware_1.default, new DesconectarContaController_1.DesconectarContaController().handle);
exports.routes.put('/senha', AdmMiddleware_1.default, new AlterarSenhaController_1.AlterarSenhaController().handle);
exports.routes.put('/dados', AdmMiddleware_1.default, new AtualizarDadosController_1.AtualizarDadosController().handle);
exports.routes.delete('/produto/:id', AdmMiddleware_1.default, new DeletarProdutoController_1.DeletarProdutoController().handle);
//pagamento callback
exports.routes.get('/sallercallback', new obterContaVendedor_1.ObterContaVendedor().handle);
exports.routes.post('/paymentcallback', new respostasPagamento_1.RespostasPagamento().handle);
