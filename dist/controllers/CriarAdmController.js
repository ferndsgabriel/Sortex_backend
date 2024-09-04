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
exports.CriarAdmController = void 0;
const CriarAdmServices_1 = require("../services/CriarAdmServices");
class CriarAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, photo, sub, pass } = req.body; // obter os dados no body
            const criarAdmServices = new CriarAdmServices_1.CriarAdmServices(); // instancio o service
            try {
                yield criarAdmServices.execute({
                    name, email, photo, sub, pass
                }); // tento executar o services
                return res.status(201).json({ message: 'Administrador criado com sucesso.' }); // sucesso ao criar algo
            }
            catch (error) {
                return res.status(400).json({ error: error.message }); // erro do cliente
            }
        });
    }
}
exports.CriarAdmController = CriarAdmController;
