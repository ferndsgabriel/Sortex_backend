"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverySchema = void 0;
const mongoose_1 = require("mongoose");
const onDay = new Date();
exports.recoverySchema = new mongoose_1.Schema({
    admRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    cod: {
        type: String,
        required: false
    },
    period: {
        type: Date,
        require: true,
    },
    createDate: {
        type: Date,
        require: true,
        default: onDay
    }
});
