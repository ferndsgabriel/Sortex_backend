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
exports.GerarLinkSallerServices = void 0;
require("dotenv/config");
class GerarLinkSallerServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // essa rota é o primeira passo para salvar o acess token que permite realizar compras no cartão do adm
            // basicamente existe um link pré definido pelo o mp e preciso passar alguns parametros voltados para a indentificar minha aplicação
            // tambem passo o id, pois vou usa-lo para criar um registro da conta do adm no db
            // proximo passo em mercadopago/getSaller;
            const baseUrl = 'https://auth.mercadopago.com.br/authorization?';
            const clientId = `client_id=${process.env.MERCADO_PAGO_CLIENT_ID}`;
            const body = '&response_type=code&platform_id=mp&';
            const redirect = `redirect_uri=${process.env.BASE_URL}`;
            const idReq = `&state=${id}`;
            const result = `${baseUrl}${clientId}${body}${redirect}${idReq}`;
            return ({ url: result });
        });
    }
}
exports.GerarLinkSallerServices = GerarLinkSallerServices;
