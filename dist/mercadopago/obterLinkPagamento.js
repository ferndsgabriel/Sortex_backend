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
function ObterLinkPagamento(_a) {
    return __awaiter(this, arguments, void 0, function* ({ accessToken, amount, description, user, sorteioId, qtd }) {
        const total = amount * qtd;
        const porcentagem = 3;
        const valuePlataform = parseFloat((total * (porcentagem / 100)).toFixed(2));
        const application = valuePlataform >= 0.01 ? valuePlataform : null;
        const client = new mercadopago_1.MercadoPagoConfig({ accessToken: accessToken });
        const payment = new mercadopago_1.Payment(client);
        const body = {
            application_fee: application,
            transaction_amount: total,
            description: description,
            payment_method_id: 'pix',
            payer: {
                email: (0, formats_1.formatEmail)(user.email),
                first_name: user.name.split(' ')[0], // Assume o primeiro nome
                last_name: user.name.split(' ')[1]
            },
            metadata: {
                sorteioId: sorteioId,
                user: user
            },
        }; // corpo da função
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
            throw (error.code);
        }
    });
}
exports.default = ObterLinkPagamento;
