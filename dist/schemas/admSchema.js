"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admSchema = void 0;
const mongoose_1 = require("mongoose");
const onDay = new Date();
exports.admSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
        required: true,
    },
    sub: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    sessionToken: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        require: true,
        default: onDay
    },
}); // schema de adm
