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
const formats_1 = require("../utils/formats");
function gerarLinkPagamento(_a) {
    return __awaiter(this, arguments, void 0, function* ({ accessToken, amount, description, user, method, sorteioId }) {
        const client = new mercadopago_1.MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 5000 } });
        const payment = new mercadopago_1.Payment(client);
        const body = {
            transaction_amount: amount,
            description: description,
            payment_method_id: method,
            payer: {
                email: (0, formats_1.formatEmail)(user.email),
            },
            metadata: {
                sorteioId: sorteioId,
                user: user
            },
        };
        try {
            const sucess = yield payment.create({ body });
            const transactionData = sucess.point_of_interaction.transaction_data;
            return {
                id: sucess.id,
                url: transactionData.ticket_url,
                status: sucess.status,
                statusDetail: sucess.status_detail
            };
        }
        catch (error) {
            console.log(error);
            throw new Error('Erro ao gerar link de pagamento');
        }
    });
}
exports.default = gerarLinkPagamento;
