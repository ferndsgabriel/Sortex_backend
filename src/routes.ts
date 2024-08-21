// imports funcionamento
import { Router } from "express";
import { Response, Request, NextFunction } from "express";
import multer from "multer";

//middlewares imports
import AdmMiddleware  from "./middlewares/AdmMiddleware";
import uploadMiddlewareInstance from "./middlewares/FirebaseMiddlewara";

//imports controlles
import {connection} from "./mongo";
import { CriarAdmController } from "./controllers/CriarAdmController";
import { LogarAdmController } from "./controllers/LogarAdmController";
import { DetalhesAdmController } from "./controllers/DetalhesAdmController";
import { CriarProdutoController } from "./controllers/CriarProdutoController";
import { GerarLinkSallerController } from "./controllers/GerarLinkSallerController";
import { ListProdutosAdmController } from "./controllers/ListProdutosAdmController";
import { CriarSorteioController } from "./controllers/CriarSorteioController";
import { GerarLinkPagamentoRifaController } from "./controllers/GerarLinkPagamentoRifaController";
import { FinalizarRifasController } from "./controllers/FinalizarRifasController";
import { SortearProdutoController } from "./controllers/SortearProdutoController";
import { EncerrarSorteioController } from "./controllers/EncerrarSorteioController";

import AtualizarAcessToken from "./mercadopago/atualizarAcessToken";

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
    routes.post('/adm', new CriarAdmController().handle); // cadastrar
    routes.post('/authadm', new LogarAdmController().handle); // logar
    routes.get('/adm', AdmMiddleware,  new DetalhesAdmController().handle); // logar
    routes.post('/product', AdmMiddleware, Multer.array('files'), uploadMiddlewareInstance, new CriarProdutoController().handle); // criar produto
    routes.get('/linksaller', AdmMiddleware, new GerarLinkSallerController().handle);
    routes.get('/products', AdmMiddleware, new ListProdutosAdmController().handle);
    routes.post('/sortex', AdmMiddleware, new CriarSorteioController().handle);
    routes.post('/payment',  new GerarLinkPagamentoRifaController().handle);
    routes.put('/finalizarrifas', AdmMiddleware, new FinalizarRifasController().handle);
    routes.put('/sortear', AdmMiddleware, new SortearProdutoController().handle);
    routes.put('/finalizarsorteio', AdmMiddleware, new EncerrarSorteioController().handle);
    //pagamento callback
    routes.get('/sallercallback', new ObterContaVendedor().handle);
    routes.post('/paymentcallback', new RespostasPagamento().handle);
