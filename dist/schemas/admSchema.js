"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admSchema = void 0;
const mongoose_1 = require("mongoose");
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
}); // schema de adm
