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
exports.GerarLinkPagamentoRifaController = void 0;
const GerarLinkPagamentoRifaServices_1 = require("../services/GerarLinkPagamentoRifaServices");
class GerarLinkPagamentoRifaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sorteioId, email, name, whatsapp, qtd } = req.body;
            const gerarLinkPagamentoRifaServices = new GerarLinkPagamentoRifaServices_1.GerarLinkPagamentoRifaServices();
            try {
                const response = yield gerarLinkPagamentoRifaServices.execute({
                    sorteioId, email, name, whatsapp, qtd
                });
                return res.status(200).json(response);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.GerarLinkPagamentoRifaController = GerarLinkPagamentoRifaController;
