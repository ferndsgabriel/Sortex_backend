"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produtoSchema = void 0;
const mongoose_1 = require("mongoose");
const onDay = new Date();
exports.produtoSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photos: {
        type: [],
        required: true,
    },
    admRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Administradores',
        required: true,
    },
    createDate: {
        type: Date,
        require: true,
        default: onDay
    }
});
