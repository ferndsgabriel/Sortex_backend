import { Request, Response } from "express";
import { DeletarProdutoServices } from "../services/DeletarProdutoServices";

class DeletarProdutoController{
    async handle(req:Request, res:Response){
        
        const {id} = req.params;

        const deleteProduct = new DeletarProdutoServices();

        try {
            const response = await deleteProduct.execute(id);
            return res.status(204).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }   
}

export {DeletarProdutoController};

