import { Request, Response } from "express";
import { FinalizarRifasServices } from "../services/FinalizarRifasServices";

class FinalizarRifasController{
    async handle(req:Request, res:Response){

        const {id} = req.body;
        
        const finalizarSorteioServices = new FinalizarRifasServices();
        try{
            const response = await finalizarSorteioServices.execute(id);
            return res.status(200).json(response); //retorno um sucess
            
        }catch(error){
            return res.status(400).json({error:error.message});; //retorno o erro
        }
    }
}

export {FinalizarRifasController}