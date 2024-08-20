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
exports.SortearProdutoController = void 0;
const SortearProdutoServices_1 = require("../services/SortearProdutoServices");
class SortearProdutoController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sorteioId } = req.body;
            const sortearProdutoServices = new SortearProdutoServices_1.SortearProdutoServices();
            try {
                const response = yield sortearProdutoServices.execute(sorteioId);
                return res.status(200).json(response); //sucesso
            }
            catch (error) {
                return res.status(400).json(error.message); //erro
            }
        });
    }
}
exports.SortearProdutoController = SortearProdutoController;
