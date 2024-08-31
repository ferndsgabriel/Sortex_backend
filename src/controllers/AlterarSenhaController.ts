import { Request, Response } from "express";
import { AlterarSenhaServices } from "../services/AlterarSenhaServices";

class AlterarSenhaController{
    async handle(req:Request, res:Response){
        const id = req.adm_id;
        const {senhaAntiga, senhaNova} = req.body;

        const alterarSenha = new AlterarSenhaServices();

        try {
            const response = await alterarSenha.execute({id, senhaAntiga, senhaNova});
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {AlterarSenhaController}