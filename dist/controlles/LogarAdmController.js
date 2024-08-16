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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogarAdmController = void 0;
const LogarAdmServices_1 = require("../services/LogarAdmServices");
class LogarAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sub, email } = req.body;
            const logarAdmServives = new LogarAdmServices_1.LogarAdmServives();
            try {
                const response = yield logarAdmServives.execute({ sub, email });
                return res.status(200).json(response);
            }
            catch (error) {
                return res.status(400).json(error.message);
            }
        });
    }
}
exports.LogarAdmController = LogarAdmController;
