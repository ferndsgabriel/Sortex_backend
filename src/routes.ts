// imports funcionamento
import { Router } from "express";
import { Response, Request, NextFunction } from "express";
import multer from "multer";

//middlewares imports
import AdmMiddleware  from "./middlewares/AdmMiddleware";
import uploadMiddlewareInstance from "./middlewares/FirebaseMiddlewara";

//imports controlles

//import no auth
import {connection} from "./mongo";
import { CriarAdmController } from "./controllers/CriarAdmController";
import { EnviarLinkRecuperacaoController } from "./controllers/EnviarLinkRecuperacaoController";
import { RecuperarSenhaController } from "./controllers/RecuperarSenhaController";
import { LogarAdmController } from "./controllers/LogarAdmController";
import { GerarLinkPagamentoRifaController } from "./controllers/GerarLinkPagamentoRifaController";
import { ProcurarCodRecuperacaoController } from "./controllers/ProcurarCodRecuperacaoController";

// imports auth
import { DetalhesAdmController } from "./controllers/DetalhesAdmController";
import { CriarProdutoController } from "./controllers/CriarProdutoController";
import { GerarLinkSallerController } from "./controllers/GerarLinkSallerController";
import { ListProdutosAdmController } from "./controllers/ListProdutosAdmController";
import { CriarSorteioController } from "./controllers/CriarSorteioController";
import { AlterarStatusRifaController } from "./controllers/AlterarStatusRifaController";
import { SortearProdutoController } from "./controllers/SortearProdutoController";
import { EncerrarSorteioController } from "./controllers/EncerrarSorteioController";
import { CriarSocialMediaController } from "./controllers/CriarSocialMediaController";
import { DeletarSocialMediaController } from "./controllers/DeletarSocialMediaController";
import { ListarRedesSociaisController } from "./controllers/ListarRedesSociaisController";
import { ContaMercadoPagoController } from "./controllers/ContaMercadoPagoController";
import { DesvincularContaMPController } from "./controllers/DesvincularContaMPController";
import { DesconectarContaController } from "./controllers/DesconectarContaController";
import { AlterarSenhaController } from "./controllers/AlterarSenhaController";
import { AtualizarDadosController } from "./controllers/AtualizarDadosController";
import { ProdutoDetalhesController } from "./controllers/ProdutoDetalhesController";
import { DeletarProdutoController } from "./controllers/DeletarProdutoController";
import { EditarProdutosController } from "./controllers/EditarProdutosController";
import { ListarSorteiosAtivosController } from "./controllers/ListarSorteiosAtivosController";
import { ListarSorteiosFinalizadosController } from "./controllers/ListarSorteiosFinalizadosController";
import { RifaDetalhesController } from "./controllers/RifaDetalhesController";

//imports pagamento callback
import { ObterContaVendedor } from "./mercadopago/obterContaVendedor";
import { RespostasPagamento } from "./mercadopago/respostasPagamento";

const Multer = multer({ storage: multer.memoryStorage() }); // multer para upload de arquivos

export const routes = Router(); // importando para poder utilizar no App;

// criando as rotas
routes.get('/', async (req: Request, res: Response) => {
    try {
        const data = new Date();
        console.log('Endpoint ativo')
        return res.send({
            Data:  data,
            Status: "Ativo"
        })} catch (error) {
            return res.status(500).send('Erro ao conectar no servidor.');
        }
    });

    routes.get('/mongo', async (req: Request, res: Response, next: NextFunction) => {
        try {
            await connection;
            return res.send({
                Resultado: "Sucesso ao conectar com o banco mongodb"
            });
        } catch (error) {
            next(error);  // Passa o erro para o middleware de tratamento de erros
        }
    });
    

    //endpoints rotas de paginas

    // rotas sem autenticação
    routes.post('/adm', new CriarAdmController().handle); // cadastrar
    routes.post('/authadm', new LogarAdmController().handle); // logar
    routes.get('/raffle', new RifaDetalhesController().handle);
    routes.post('/pagamento',  new GerarLinkPagamentoRifaController().handle);
    routes.post('/recovery', new EnviarLinkRecuperacaoController().handle);
    routes.put('/recovery', new RecuperarSenhaController().handle);
    routes.get('/recovery', new ProcurarCodRecuperacaoController().handle);
    
    // rotas com autenticação
    routes.get('/adm', AdmMiddleware,  new DetalhesAdmController().handle); // logar
    routes.post('/produtos', AdmMiddleware, Multer.array('files'), uploadMiddlewareInstance, new CriarProdutoController().handle); // criar produto
    routes.put('/produto/:id', AdmMiddleware, Multer.array('files'), uploadMiddlewareInstance, new EditarProdutosController().handle); // editar produto
    routes.get('/linksaller', AdmMiddleware, new GerarLinkSallerController().handle);
    routes.get('/produtos', AdmMiddleware, new ListProdutosAdmController().handle);
    routes.get('/produto/:id', AdmMiddleware, new ProdutoDetalhesController().handle);
    routes.post('/sorteio', AdmMiddleware, new CriarSorteioController().handle);
    routes.put('/status', AdmMiddleware, new AlterarStatusRifaController().handle);
    routes.put('/sortear', AdmMiddleware, new SortearProdutoController().handle);
    routes.put('/finalizarsorteio', AdmMiddleware, new EncerrarSorteioController().handle);
    routes.post('/sociais', AdmMiddleware, new CriarSocialMediaController().handle);
    routes.delete('/sociais', AdmMiddleware, new DeletarSocialMediaController().handle);
    routes.get('/sociais', AdmMiddleware, new ListarRedesSociaisController().handle);
    routes.get('/sorteiosprogress', AdmMiddleware, new ListarSorteiosAtivosController().handle);
    routes.get('/sorteiosfinished', AdmMiddleware, new ListarSorteiosFinalizadosController().handle);
    routes.get('/account', AdmMiddleware, new ContaMercadoPagoController().handle);
    routes.delete('/account', AdmMiddleware, new DesvincularContaMPController().handle);
    routes.put('/session', AdmMiddleware, new  DesconectarContaController().handle);
    routes.put('/senha', AdmMiddleware, new  AlterarSenhaController().handle);
    routes.put('/dados', AdmMiddleware, new  AtualizarDadosController().handle);
    routes.delete('/produto/:id', AdmMiddleware, new DeletarProdutoController().handle);

    //pagamento callback
    routes.get('/sallercallback', new ObterContaVendedor().handle);
    routes.post('/paymentcallback', new RespostasPagamento().handle);

