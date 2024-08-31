import { Request, Response } from "express";
import { ContaMercadoPagoServices } from "../services/ContaMercadoPagoServices";

class ContaMercadoPagoController{
    async handle(req:Request, res:Response){
        const id = req.adm_id;

        const contaMP = new ContaMercadoPagoServices();

        try {
            const response = await contaMP.execute(id);
            return res.status(200).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {ContaMercadoPagoController}