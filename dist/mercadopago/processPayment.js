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
exports.processPayment = void 0;
const mercadopago_1 = require("mercadopago");
require("dotenv/config");
class processPayment {
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ value }) {
            const client = new mercadopago_1.MercadoPagoConfig({
                accessToken: process.env.MERCADO_PAG0_ACESS_TOKEN,
                options: { timeout: 5000, idempotencyKey: 'abc' }
            });
            const payment = new mercadopago_1.Payment(client);
            const body = {
                transaction_amount: value,
                description: 'Teste',
                payment_method_id: 'pix',
                payer: {
                    email: 'gabrielsilvafernandes5760@gmail.com'
                },
            };
            const bodyMe = {
                transaction_amount: value,
                description: 'Teste',
                payment_method_id: 'pix',
                payer: {
                    email: 'gabrielsilvafernandes5760@gmail.com'
                },
            };
            yield payment.create({ body }).then(console.log).catch(console.log);
        });
    }
}
exports.processPayment = processPayment;
