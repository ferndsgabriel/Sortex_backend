import { Request,Response } from "express";
import { RecuperarSenhaServices } from "../services/RecuperarSenhaServices";

class RecuperarSenhaController{
    async handle(req:Request, res:Response){
        const {id, pass, cod} = req.body;

        const recuperar = new RecuperarSenhaServices();

        try {
            const response = await recuperar.execute({
                cod:cod,
                id:id,
                pass:pass
            });
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export  {RecuperarSenhaController}