import { Request, Response, response } from "express";
import { DetalhesAdmServices } from "../services/DetalhesAdmServices";

class DetalhesAdmController{
    async handle(req:Request, res:Response){
        const id = req.adm_id;
        const detalhesAdmServices = new DetalhesAdmServices();
        try{
            const response = await detalhesAdmServices.execute(id);
            return res.status(200).json(response);
            
        }catch(error){
            return res.status(400).json(error);
        }
    }
}

export {DetalhesAdmController}