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
exports.AdmMiddleware = AdmMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
function AdmMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenDeAuth = req.headers.authorization;
        if (!tokenDeAuth) {
            return res.status(401).send('Rota não autorizada').end();
        }
        const [prefix, token] = tokenDeAuth.split(' ');
        try {
            const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.UJWT_ADM);
            if (!sub) {
                return res.status(401).send('Rota não autorizada').end();
            }
            req.adm_id = sub;
            return next();
        }
        catch (err) {
            return res.status(401).send('Rota não autorizada').end();
        }
    });
}
