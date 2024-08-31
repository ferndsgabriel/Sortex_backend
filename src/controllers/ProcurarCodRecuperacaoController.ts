import { Request, Response } from "express";
import { ProcurarCodRecuperacaoServices } from "../services/ProcurarCodRecuperacaoServices";

class ProcurarCodRecuperacaoController{
    async handle(req:Request, res:Response){
        const cod = Array.isArray(req.headers.cod) ? req.headers.cod[0] : req.headers.cod;
        const id = Array.isArray(req.headers.id) ? req.headers.id[0] : req.headers.id;


        const ProcurarCod = new ProcurarCodRecuperacaoServices();

        try {
            const response = await ProcurarCod.execute({cod, id});
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {ProcurarCodRecuperacaoController}