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
exports.DetalhesAdmServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
class DetalhesAdmServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Id não enviado');
            } //verifico se estou recebendo um id
            const admModel = mongoose_1.default.model('Administrador', admSchema_1.admSchema); // crrio um model da minha tabela adm
            const obterAdm = yield admModel.findById(id); // verifico se existe um adm com o id pasado
            if (!obterAdm) {
                throw new Error('Administrador não encontrado');
            } // se n existir retorno um erro
            return ({
                name: obterAdm.name,
                email: obterAdm.email,
                photo: obterAdm.photo,
                id: obterAdm._id
            });
        });
    }
}
exports.DetalhesAdmServices = DetalhesAdmServices;
