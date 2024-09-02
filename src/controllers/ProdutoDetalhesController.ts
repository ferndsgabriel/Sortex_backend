import { Request, Response } from "express"
import { ProdutoDetalhesServices } from "../services/ProdutoDetalhesServices";

class ProdutoDetalhesController{

    async handle(req:Request, res:Response){
        const {id} = req.params;
        
        const produtoDetalhes = new ProdutoDetalhesServices();

        try{
            const response = await produtoDetalhes.execute(id);
            return res.status(200).json(response);
        }catch(error){
            return res.status(400).json({error:error.message});
        }
    }
}

export {ProdutoDetalhesController}