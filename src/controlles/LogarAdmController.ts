import { Request, Response } from "express";
import { LogarAdmServives } from "../services/LogarAdmServices";

class LogarAdmController{
    async handle(req:Request, res:Response){
        const {sub, email} = req.body;
        
        const logarAdmServives = new LogarAdmServives();
        try{
            const response = await logarAdmServives.execute({sub, email});
            return res.status(200).json(response);
        }catch(error:any){
            return res.status(400).json(error.message);
        }
    }
}

export {LogarAdmController}