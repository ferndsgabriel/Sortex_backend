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
require("dotenv/config");
const clientId = process.env.MERCADO_PAGO_CLIENT_ID;
const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET;
const redirectUri = `${process.env.BASE_URL}/sallercallback`;
const getAccessToken = (authCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.mercadopago.com/oauth/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: authCode,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const accessToken = response.data.access_token;
        return accessToken;
    }
    catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
});
exports.default = getAccessToken;
