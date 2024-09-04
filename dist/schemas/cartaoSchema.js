"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardSchema = void 0;
const mongoose_1 = require("mongoose");
const onDay = new Date();
exports.cardSchema = new mongoose_1.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    admRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Administradores',
        required: true,
        unique: true
    },
    createDate: {
        type: Date,
        require: true,
        default: onDay
    }
});
