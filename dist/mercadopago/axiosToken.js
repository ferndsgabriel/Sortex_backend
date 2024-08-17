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
const axios_1 = __importDefault(require("axios"));
// Substitua pelos valores reais
const clientId = '3875468438633898';
const clientSecret = 'eq3X60nI9yfXl2lixEIa6ITMfM7HbmYS';
const getAccessToken = (authCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.mercadopago.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: 'https://sortexbackend.vercel.app/sallercallback'
            },
            auth: {
                username: clientId,
                password: clientSecret
            }
        });
        return response.data.access_token;
    }
    catch (error) {
        return;
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error to be caught in the caller
    }
});
exports.default = getAccessToken;
