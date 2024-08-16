"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const uri = process.env.DB_URL; //obtendo uri do db
exports.connection = mongoose_1.default.connect(uri).then(() => {
    console.log('Banco conectado com sucesso');
}).catch((error) => {
    console.log(`Erro ao conectar ao db, erro: ${error}`);
}); //configuração de inicialização do banco
