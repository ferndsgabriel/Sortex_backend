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
exports.ListarRedesSociaisServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const socialSchema_1 = require("../schemas/socialSchema");
class ListarRedesSociaisServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Id do administrador não encontrado');
            }
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema);
            const procurarAdm = yield admModel.findById(id);
            if (!procurarAdm) {
                throw new Error("Administrador não encontrado");
            }
            const sociaisModel = mongoose_1.default.model('Sociais', socialSchema_1.socialSchema);
            const procurarSociais = yield sociaisModel.findOne({ admRef: id }).catch((error) => {
                console.log(error);
                throw new Error('Erro ao encontrar redes sociais');
            });
            return procurarSociais;
        });
    }
}
exports.ListarRedesSociaisServices = ListarRedesSociaisServices;
