"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEmail = formatEmail;
function formatEmail(email) {
    const removerEspaço = email.trim();
    const deixarMinusculo = removerEspaço.toLocaleLowerCase();
    return deixarMinusculo.toString();
}
