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
exports.LogarAdmController = void 0;
const LogarAdmServices_1 = require("../services/LogarAdmServices");
class LogarAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sub, email } = req.body; // peço o sub, e o email
            //obs... o sub do token de auth e o sub que é usado na hora de cadastrar/logar são diferentes
            //o google devolve esse sub como indentificador de acesso quando vc faz login utiliando a conta do google
            const logarAdmServives = new LogarAdmServices_1.LogarAdmServives(); // instanciar...
            try {
                const response = yield logarAdmServives.execute({ sub, email });
                return res.status(200).json(response); //sucesso
            }
            catch (error) {
                return res.status(400).json(error.message); //erro
            }
        });
    }
}
exports.LogarAdmController = LogarAdmController;
