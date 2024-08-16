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
exports.routes = void 0;
// imports funcionamento
const express_1 = require("express");
//middlewares imports
const AdmMiddleware_1 = require("./middlewares/AdmMiddleware");
//imports controlles
const mongo_1 = require("./mongo");
const CriarAdmController_1 = require("./controlles/CriarAdmController");
const LogarAdmController_1 = require("./controlles/LogarAdmController");
exports.routes = (0, express_1.Router)(); // importando para poder utilizar no App;
// criando as rotas
exports.routes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = new Date();
        console.log('Endpoint ativo');
        return res.send({
            Data: data,
            Status: "Ativo"
        });
    }
    catch (error) {
        return res.status(500).send('Erro ao conectar no servidor.');
    }
}));
exports.routes.get('/mongo', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongo_1.connection;
        return res.send({
            Resultado: "Sucesso ao conectar com o banco mongodb"
        });
    }
    catch (error) {
        next(error); // Passa o erro para o middleware de tratamento de erros
    }
}));
//endpoints rotas de paginas
exports.routes.post('/adm', new CriarAdmController_1.CriarAdmController().handle); // cadastrar
exports.routes.post('/authadm', new LogarAdmController_1.LogarAdmController().handle); // logar
exports.routes.get('/adm', AdmMiddleware_1.AdmMiddleware, new LogarAdmController_1.LogarAdmController().handle); // logar
