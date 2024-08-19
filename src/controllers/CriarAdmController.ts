import { Request, Response } from "express";
import { CriarAdmServices } from "../services/CriarAdmServices";

class CriarAdmController {
    async handle(req:Request, res:Response){
        const { name, email, photo, sub } = req.body; // obter os dados no body
        const criarAdmServices = new CriarAdmServices(); // instancio o service

        try{
            await criarAdmServices.execute({
                name, email, photo, sub
            }); // tento executar o services
            return res.status(201).json({ message: 'Administrador criado com sucesso.' }); // sucesso ao criar algo
        }catch(error){
            return res.status(400).json({error:error.message}); // erro do cliente
        }
    }
}

export {CriarAdmController}