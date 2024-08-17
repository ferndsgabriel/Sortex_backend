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
exports.DetalhesAdmController = void 0;
const DetalhesAdmServices_1 = require("../services/DetalhesAdmServices");
class DetalhesAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.adm_id; // obtenho o id através da tipagem que fiz pro request após receber o sub do token
            const detalhesAdmServices = new DetalhesAdmServices_1.DetalhesAdmServices(); //instancio... 
            try {
                const response = yield detalhesAdmServices.execute(id);
                return res.status(200).json(response); //retorno um sucess
            }
            catch (error) {
                return res.status(400).json(error); //retorno o erro
            }
        });
    }
}
exports.DetalhesAdmController = DetalhesAdmController;
