import { Request, Response } from "express";
import { SortearProdutoServices } from "../services/SortearProdutoServices";

class SortearProdutoController{
    async handle(req:Request, res:Response){

        const {sorteioId} = req.body;

        const sortearProdutoServices = new SortearProdutoServices();

        try{
            const response = await sortearProdutoServices.execute(sorteioId);
            return res.status(200).json(response); //sucesso
        }catch(error:any){
            return res.status(400).json(error.message); //erro
        }
        
    }
}
export {SortearProdutoController}