"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialSchema = void 0;
const mongoose_1 = require("mongoose");
const onDay = new Date();
exports.socialSchema = new mongoose_1.Schema({
    admRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Administradores'
    },
    instagram: {
        type: String,
        required: false,
    },
    youtube: {
        type: String,
        required: false,
    },
    tiktok: {
        type: {
            type: String,
            required: false,
        }
    },
    twitch: {
        type: String,
        required: false,
    },
    createDate: {
        type: Date,
        require: true,
        default: onDay
    }
});
