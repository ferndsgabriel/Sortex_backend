"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sorteioSchema = void 0;
const mongoose_1 = require("mongoose");
exports.sorteioSchema = new mongoose_1.Schema({
    admRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Administradores'
    },
    produtoRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Produtos'
    },
    cartaoRef: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Cartaos'
    },
    dataInicio: {
        type: Date,
        required: true
    },
    dataTermino: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    rifas: {
        type: Array,
        default: []
    },
    title: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: false // indica que não pode mais receber pagamentos
    },
    drawn: {
        type: Boolean,
        required: true,
        default: false // indica que o premio já tem um vencedor e não pode mais gerar outro vencedor 
    },
    winner: {
        type: Number,
        default: null // o winner vai ser um index, pq quando gerar o sorteio e tiver um campeão, vai ser o rifas[winner]
    }
});
