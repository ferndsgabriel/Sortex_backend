import { Request, Response } from "express";
import { AtualizarDadosServices } from "../services/AtualizarDadosServices";

class AtualizarDadosController{
    async handle(req:Request, res:Response){
        const id = req.adm_id;
        const {sub, email, name, photo} = req.body;

        const atualizarDados = new AtualizarDadosServices();

        try {
            const response = await atualizarDados.execute({id, sub, email, name, photo,});
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {AtualizarDadosController}