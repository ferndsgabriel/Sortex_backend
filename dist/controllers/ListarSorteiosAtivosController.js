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
exports.ListarSorteiosAtivosController = void 0;
const ListarSorteiosAtivosServices_1 = require("../services/ListarSorteiosAtivosServices");
class ListarSorteiosAtivosController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.adm_id;
            // Captura parâmetros de consulta com req.query
            const per_page = req.query.per_page;
            const page = req.query.page;
            const listarSorteios = new ListarSorteiosAtivosServices_1.ListarSorteiosAtivosServices();
            try {
                const response = yield listarSorteios.execute({ id, per_page, page });
                return res.status(200).json(response); // Retorno sucesso
            }
            catch (error) {
                return res.status(400).json({ error: error.message }); // Retorno erro
            }
        });
    }
}
exports.ListarSorteiosAtivosController = ListarSorteiosAtivosController;
