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
exports.RifaDetalhesServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const sorteioShema_1 = require("../schemas/sorteioShema");
const produtoSchema_1 = require("../schemas/produtoSchema");
const socialSchema_1 = require("../schemas/socialSchema");
class RifaDetalhesServices {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error("Id do sorteio não enviado");
            }
            const sorteioModel = mongoose_1.default.model('Sorteios', sorteioShema_1.sorteioSchema);
            const procurarSorteio = yield sorteioModel.findById(id);
            if (!procurarSorteio) {
                throw new Error("Sorteio não encontrado");
            }
            const onDay = new Date();
            if (onDay >= procurarSorteio.dataTermino) {
                yield sorteioModel.findByIdAndUpdate(id, { $set: { status: false } });
            }
            const admModel = mongoose_1.default.model('Administradores', admSchema_1.admSchema);
            const procurarAdm = yield admModel.findById(procurarSorteio.admRef);
            if (!procurarAdm) {
                throw new Error("Administrador não encontrado");
            }
            const produtosModel = mongoose_1.default.model('Produtos', produtoSchema_1.produtoSchema);
            const procurarProduto = yield produtosModel.findById(procurarSorteio.produtoRef);
            if (!procurarProduto) {
                throw new Error("Produto não encontrado");
            }
            const sociaisModel = mongoose_1.default.model('Sociais', socialSchema_1.socialSchema);
            const procurarSociais = yield sociaisModel.findOne({ admRef: procurarSorteio.admRef });
            const sorteio = {
                _id: procurarSorteio._id,
                title: procurarSorteio.title,
                description: procurarSorteio.description,
                price: procurarSorteio.price,
                rafflesStatus: procurarSorteio.status,
                sortexStatus: procurarSorteio.drawn,
                dateStart: procurarSorteio.createDate,
                dateFinish: procurarSorteio.dataTermino,
            };
            const produto = {
                name: procurarProduto.name,
                description: procurarProduto.description,
                photos: procurarProduto.photos
            };
            const criador = {
                name: procurarAdm.name,
                photo: procurarAdm.photo,
            };
            const sociais = {
                instagram: procurarSociais.instagram,
                youtube: procurarSociais.youtube,
                twitch: procurarSociais.twitch,
                tiktok: procurarSociais.tiktok
            };
            return {
                creator: criador,
                socials: sociais,
                product: produto,
                sortex: sorteio
            };
        });
    }
}
exports.RifaDetalhesServices = RifaDetalhesServices;
