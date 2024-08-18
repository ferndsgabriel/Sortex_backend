import { Request, Response } from "express"
import { ListProdutosAdmServices } from "../services/ListProdutosAdmServices";

class ListProdutosAdmController{

    async handle(req:Request, res:Response){
        const id = req.adm_id;
        const listProdutosAdmServices = new ListProdutosAdmServices();

        try{
            const response = await listProdutosAdmServices.execute(id);
            return res.status(200).json(response);
        }catch(error){
            return res.status(400).json({error:error.message});
        }
    }
}

export {ListProdutosAdmController}