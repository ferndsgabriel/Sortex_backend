import { Request, Response } from "express"
import { ListarRedesSociaisServices } from "../services/ListarRedesSociaisServices";

class ListarRedesSociaisController{
    async handle(req:Request, res:Response){

        const id = req.adm_id;

        const listarRedes = new ListarRedesSociaisServices();
        
        try {
            const response = await listarRedes.execute(id);
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {ListarRedesSociaisController}