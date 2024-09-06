import { Request, Response } from "express";
import { AlterarStatusRifaServices } from "../services/AlterarStatusRifaServices";

class AlterarStatusRifaController{
    async handle(req:Request, res:Response){

        const {id, status} = req.body;
        
        const alterarStatus = new AlterarStatusRifaServices();
        try{
            const response = await alterarStatus.execute(id, status);
            return res.status(200).json(response); //retorno um sucess
            
        }catch(error){
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {AlterarStatusRifaController}