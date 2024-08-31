import { Request, Response } from "express";
import { DesconectarContaServices } from "../services/DesconectarContaServices";


class DesconectarContaController{
    async handle(req:Request, res:Response){
        const id = req.adm_id;

        const desconectar = new DesconectarContaServices();

        try {
            const response = await desconectar.execute(id);
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}
export {DesconectarContaController}