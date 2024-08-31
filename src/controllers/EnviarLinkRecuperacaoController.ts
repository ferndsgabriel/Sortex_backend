import { Request,Response } from "express";
import { EnviarLinkRecuperacaoServices } from "../services/EnviarLinkRecuperacaoServices";

class EnviarLinkRecuperacaoController{
    async handle(req:Request, res:Response){
        const {email} = req.body;

        const enviarLink = new EnviarLinkRecuperacaoServices();

        try {
            const response = await enviarLink.execute(email);
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export  {EnviarLinkRecuperacaoController}