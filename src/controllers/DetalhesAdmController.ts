import { Request, Response } from "express";
import { DetalhesAdmServices } from "../services/DetalhesAdmServices";

class DetalhesAdmController{
    async handle(req:Request, res:Response){

        const id = req.adm_id; // obtenho o id através da tipagem que fiz pro request após receber o sub do token

        const detalhesAdmServices = new DetalhesAdmServices(); //instancio... 
        try{
            const response = await detalhesAdmServices.execute(id);
            return res.status(200).json(response); //retorno um sucess
            
        }catch(error){
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {DetalhesAdmController}