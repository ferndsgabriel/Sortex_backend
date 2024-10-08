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
const accessToken = process.env.MERCADO_PAG0_ACCESS_TOKEN;
const axiosPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
    try {
        const response = yield axios_1.default.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
});
exports.default = axiosPayment;
