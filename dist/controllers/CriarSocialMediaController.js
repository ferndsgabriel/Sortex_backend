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
exports.CriarSocialMediaController = void 0;
const CriarSocialMediaServices_1 = require("../services/CriarSocialMediaServices");
class CriarSocialMediaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { youtube, twitch, tiktok, instagram } = req.body;
            const adm = req.adm_id;
            const criarSocialMedia = new CriarSocialMediaServices_1.CriarSocialMediaServices();
            try {
                const response = yield criarSocialMedia.execute({ adm, youtube, twitch, tiktok, instagram });
                return res.status(201).json(response); //retorno um sucess
            }
            catch (error) {
                return res.status(400).json({ error: error.message }); //retorno o erro
            }
        });
    }
}
exports.CriarSocialMediaController = CriarSocialMediaController;
