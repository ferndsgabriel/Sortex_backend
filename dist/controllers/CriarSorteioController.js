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
exports.CriarSorteioController = void 0;
const CriarSorteioServices_1 = require("../services/CriarSorteioServices");
class CriarSorteioController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, dataInicio, dataTermino, price, title } = req.body;
            const id = req.adm_id;
            const criarSorteioServices = new CriarSorteioServices_1.CriarSorteioServices();
            try {
                const response = yield criarSorteioServices.execute({
                    productId, dataInicio, dataTermino, price, title, id
                });
                return res.status(200).json(response);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
                ;
            }
        });
    }
}
exports.CriarSorteioController = CriarSorteioController;
