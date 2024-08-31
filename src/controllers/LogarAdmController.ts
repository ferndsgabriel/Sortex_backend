import { Request, Response } from "express";
import { LogarAdmServives } from "../services/LogarAdmServices";

class LogarAdmController{
    async handle(req:Request, res:Response){

        const {sub, email, pass} = req.body; // peço o sub, e o email
        //obs... o sub do token de auth e o sub que é usado na hora de cadastrar/logar são diferentes
        //o google devolve esse sub como indentificador de acesso quando vc faz login utiliando a conta do google
        
        const logarAdmServives = new LogarAdmServives(); // instanciar...
        try{
            const response = await logarAdmServives.execute({sub, email, pass});
            return res.status(200).json(response); //sucesso
        }catch(error:any){
            return res.status(400).json(error.message); //erro
        }
    }
}

export {LogarAdmController}