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
const mercadopago_1 = require("mercadopago");
function AtualizarAcessToken(refreshToken, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const client_id = process.env.MERCADO_PAGO_CLIENT_ID;
        const client_secret = process.env.MERCADO_PAGO_CLIENT_SECRET;
        const client = new mercadopago_1.MercadoPagoConfig({ accessToken: access_token, options: { timeout: 5000 } });
        const oauth = new mercadopago_1.OAuth(client);
        try {
            const response = yield oauth.refresh({
                body: {
                    client_secret: client_secret,
                    client_id: client_id,
                    refresh_token: refreshToken
                }
            });
            const data = {
                accesstoken: response.access_token,
                refreshToken: response.refresh_token,
            };
            return data;
        }
        catch (error) {
            return error;
        }
    });
}
exports.default = AtualizarAcessToken;
