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
exports.DeletarSocialMediaServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const socialSchema_1 = require("../schemas/socialSchema");
class DeletarSocialMediaServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            if (!id) {
                throw new Error('Id não enviado');
            }
            const socialModel = mongoose_1.default.model('Sociais', socialSchema_1.socialSchema);
            const procurarSocial = yield socialModel.findById(id);
            if (!procurarSocial) {
                throw new Error("Rede social não encontrada");
            }
            const response = yield socialModel.findByIdAndDelete(id).catch((error) => {
                console.log(error);
                throw new Error('Erro ao deletar rede social');
            });
            return response;
        });
    }
}
exports.DeletarSocialMediaServices = DeletarSocialMediaServices;
