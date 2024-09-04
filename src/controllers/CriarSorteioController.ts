import { Request, Response } from "express";
import { CriarSorteioServices } from "../services/CriarSorteioServices";

class CriarSorteioController{
    async handle(req:Request, res:Response){

        const {productId, dataTermino, price, title,description} = req.body;
        const id = req.adm_id;

        const criarSorteioServices = new CriarSorteioServices();

        try{
            const response = await criarSorteioServices.execute({
                productId, dataTermino, price, title,id,description
            });
            return res.status(201).json(response)
        }catch(error){
            return res.status(400).json({error:error.message});
        }
    }
}

export {CriarSorteioController}