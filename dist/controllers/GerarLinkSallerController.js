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
exports.GerarLinkSallerController = void 0;
const GerarLinkSallerServices_1 = require("../services/GerarLinkSallerServices");
class GerarLinkSallerController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.adm_id; // id que recebo do request
            const gerarLinkSallerService = new GerarLinkSallerServices_1.GerarLinkSallerServices();
            try {
                const response = yield gerarLinkSallerService.execute(id);
                return res.status(201).json(response); //retorno um sucess
            }
            catch (error) {
                return res.status(400).json({ error: error.message }); //retorno o erro
            } // bem padrão e simples
        });
    }
}
exports.GerarLinkSallerController = GerarLinkSallerController;
