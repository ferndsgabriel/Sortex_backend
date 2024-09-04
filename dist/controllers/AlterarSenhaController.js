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
exports.AlterarSenhaController = void 0;
const AlterarSenhaServices_1 = require("../services/AlterarSenhaServices");
class AlterarSenhaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.adm_id;
            const { senhaAntiga, senhaNova } = req.body;
            const alterarSenha = new AlterarSenhaServices_1.AlterarSenhaServices();
            try {
                const response = yield alterarSenha.execute({ id, senhaAntiga, senhaNova });
                return res.status(200).json(response); //retorno um sucess
            }
            catch (error) {
                return res.status(400).json({ error: error.message }); //retorno o erro
            }
        });
    }
}
exports.AlterarSenhaController = AlterarSenhaController;
