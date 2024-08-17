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
exports.GetSaller = void 0;
const axiosToken_1 = __importDefault(require("./axiosToken"));
class GetSaller {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authCode = req.query.code;
            if (!authCode) {
                res.status(400).send('Código de autorização não encontrado.');
                return;
            }
            yield (0, axiosToken_1.default)(authCode).then((sucess) => {
                return res.json(sucess);
            }).catch((error) => {
                return res.json(error);
            });
        });
    }
}
exports.GetSaller = GetSaller;
