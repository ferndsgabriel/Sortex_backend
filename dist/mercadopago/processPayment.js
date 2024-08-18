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
class processPayment {
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            const acessToken = 'APP_USR-3875468438633898-081813-9d31fe90f35d2d54d472518259ab45d8-247395576';
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: acessToken, options: { timeout: 5000 } });
            const payment = new mercadopago_1.Payment(client);
            const body = {
                transaction_amount: 0.01,
                description: 'teste',
                payment_method_id: 'pix',
                payer: {
                    email: 'gabrielsilvafernandes5760@gmail.com'
                },
            };
            payment.create({ body }).then(console.log).catch(console.log);
        });
    }
}
exports.processPayment = processPayment;
