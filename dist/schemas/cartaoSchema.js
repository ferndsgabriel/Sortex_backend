"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardSchema = void 0;
const mongoose_1 = require("mongoose");
exports.cardSchema = new mongoose_1.Schema({
    authCode: {
        type: String,
        required: true,
    },
    admRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Administradores',
        required: true,
    }
});
