import {Request, Response } from "express";
import { DesvincularContaMPServices } from "../services/DesvincularContaMPServices";

class DesvincularContaMPController{
    async handle(req:Request, res:Response){
        const id = req.adm_id;

        const desvicularConta = new DesvincularContaMPServices();

        try {
            const response = await desvicularConta.execute(id);
            return res.status(204).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {DesvincularContaMPController}