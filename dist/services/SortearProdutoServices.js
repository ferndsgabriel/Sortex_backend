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
exports.SortearProdutoServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sorteioShema_1 = require("../schemas/sorteioShema");
class SortearProdutoServices {
    execute(sorteioId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sorteioId) {
                throw new Error('Envie o id do sorteio');
            }
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema);
            const obterSorteio = yield sorteioModel.findById(sorteioId);
            if (!obterSorteio) {
                throw new Error('Sorteio não econtrado');
            }
            if (obterSorteio.status === true) {
                throw new Error('O sorteio precisa ser encerrado');
            }
            function shuffleArray(array) {
                const newArray = [...array]; // Cria uma cópia do array
                for (let i = newArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
                }
                return newArray;
            } // função que embaralha um array
            const embaralharRifas = shuffleArray(obterSorteio.rifas); // obtenho um array embaralhado
            function sortear(listLength) {
                return Math.floor(Math.random() * listLength);
            }
            const randomIndex = sortear(embaralharRifas.length);
            yield sorteioModel.updateOne({ _id: sorteioId }, { $set: { rifas: embaralharRifas, winner: randomIndex, status: false } }).then(() => {
            }).catch((error) => {
                return ('Erro ao gerar sorteio');
            }); // dou um update no db 
            return {
                winner: {
                    name: embaralharRifas[randomIndex].user.name,
                    email: embaralharRifas[randomIndex].user.email,
                    whatsapp: embaralharRifas[randomIndex].user.whatsapp,
                },
                position: randomIndex
            };
        });
    }
}
exports.SortearProdutoServices = SortearProdutoServices;
