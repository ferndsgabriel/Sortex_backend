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
exports.GerarLinkSallerServices = void 0;
require("dotenv/config");
const admSchema_1 = require("../schemas/admSchema");
const mongoose_1 = __importDefault(require("mongoose"));
class GerarLinkSallerServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // essa rota é o primeira passo para salvar o acess token que permite realizar compras no cartão do adm
            // basicamente existe um link pré definido pelo o mp e preciso passar alguns parametros voltados para a indentificar minha aplicação
            // tambem passo o id, pois vou usa-lo para criar um registro da conta do adm no db
            // proximo passo em mercadopago/getSaller;
            if (!id) {
                throw new Error("Id não encontrado");
            }
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema); // crrio um model da minha tabela adm
            const obterAdm = yield admModel.findById(id); // verifico se existe um adm com o id pasado
            if (!obterAdm) {
                throw new Error('Administrador não encontrado');
            } // se
            const baseUrl = 'https://auth.mercadopago.com.br/authorization?';
            const clientId = `client_id=${process.env.MERCADO_PAGO_CLIENT_ID}`;
            const body = '&response_type=code&platform_id=mp&';
            const redirect = `redirect_uri=${process.env.BASE_URL}/sallercallback`;
            const idReq = `&state=${id}`;
            const result = `${baseUrl}${clientId}${body}${redirect}${idReq}`;
            return ({ url: result });
        });
    }
}
exports.GerarLinkSallerServices = GerarLinkSallerServices;
