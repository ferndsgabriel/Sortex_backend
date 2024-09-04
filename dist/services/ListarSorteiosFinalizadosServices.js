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
exports.ListarSorteiosFinalizadosServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const sorteioShema_1 = require("../schemas/sorteioShema");
class ListarSorteiosFinalizadosServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, per_page, page }) {
            if (!id) {
                throw new Error('Id do administrador não encontrado');
            }
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema);
            const procurarAdm = yield admModel.findById(id);
            if (!procurarAdm) {
                throw new Error("Administrador não encontrado");
            }
            const sorteioModal = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema);
            const procurarSoreios = yield sorteioModal.find({ admRef: id, drawn: false }).catch((error) => {
                console.log(error);
                throw new Error('Erro ao encontrar sorteios');
            });
            const per_page_number = parseInt(per_page);
            const pages_number = parseInt(page);
            const pagesMax = Math.ceil(procurarSoreios.length / per_page_number);
            const sendPage = Math.max(1, Math.min(pages_number, pagesMax));
            const sliceStart = (sendPage - 1) * per_page_number;
            const sliceEnd = (sendPage * per_page_number);
            const sliceSorteio = procurarSoreios.slice(sliceStart, sliceEnd);
            return {
                itens: sliceSorteio,
                maxPages: pagesMax
            };
        });
    }
}
exports.ListarSorteiosFinalizadosServices = ListarSorteiosFinalizadosServices;
