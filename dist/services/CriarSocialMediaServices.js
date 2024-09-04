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
exports.CriarSocialMediaServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admSchema_1 = require("../schemas/admSchema");
const socialSchema_1 = require("../schemas/socialSchema");
class CriarSocialMediaServices {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ adm, youtube, twitch, tiktok, instagram }) {
            if (!adm) {
                throw new Error("Preencha todos os campos");
            }
            const admModel = mongoose_1.default.model("Administradores", admSchema_1.admSchema);
            const procuraAdm = yield admModel.findById(adm);
            if (!procuraAdm) {
                throw new Error("Administrador não encontrado");
            }
            const socialModel = mongoose_1.default.model("Sociais", socialSchema_1.socialSchema);
            const socialCadastrada = yield socialModel.findOne({ admRef: adm });
            const updateFields = {};
            if (instagram)
                updateFields.instagram = instagram;
            if (twitch)
                updateFields.twitch = twitch;
            if (youtube)
                updateFields.youtube = youtube;
            if (tiktok)
                updateFields.tiktok = tiktok;
            if (socialCadastrada) {
                yield socialModel.updateOne({ admRef: adm }, { $set: { instagram: instagram, twitch: twitch, youtube: youtube, tiktok: tiktok } });
            }
            else {
                yield socialModel.create({ admRef: adm }, { $set: { instagram: instagram, twitch: twitch, youtube: youtube, tiktok: tiktok } });
            }
            return { ok: true };
        });
    }
}
exports.CriarSocialMediaServices = CriarSocialMediaServices;
