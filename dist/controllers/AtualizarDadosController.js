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
exports.AtualizarDadosController = void 0;
const AtualizarDadosServices_1 = require("../services/AtualizarDadosServices");
class AtualizarDadosController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.adm_id;
            const { sub, email, name, photo } = req.body;
            const atualizarDados = new AtualizarDadosServices_1.AtualizarDadosServices();
            try {
                const response = yield atualizarDados.execute({ id, sub, email, name, photo, });
                return res.status(200).json(response); //retorno um sucess
            }
            catch (error) {
                return res.status(400).json({ error: error.message }); //retorno o erro
            }
        });
    }
}
exports.AtualizarDadosController = AtualizarDadosController;
