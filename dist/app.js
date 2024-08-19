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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const routes_1 = require("./routes");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
// iniciando aplicação
const app = (0, express_1.default)();
const port = process.env.Port || 3333; // definindo nossa porta
app.use((0, cors_1.default)()); // chamando a função
app.use(express_1.default.json()); // JSON middleware antes das rotas
app.use(routes_1.routes); // pedindo pro app usar as rotas do arquivo exportado
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        // Retorna o erro como JSON
        return res.status(400).json({
            error: err.message,
        });
    }
    // Erros genéricos são tratados aqui
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.',
    });
});
app.listen(port, () => {
    console.log('Servidor ativo'); //se ele estiver ativo e tudo der certo, retorna que o servidor foi ativo 
});
routes_1.routes.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send('Test endpoint working');
}));
