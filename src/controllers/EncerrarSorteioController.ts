import { Request, Response } from "express"
import { EncerrarSorteioServices } from "../services/EncerrarSorteioServices"

class EncerrarSorteioController{

    async handle(req:Request, res:Response){
        const {sorteioId} = req.body;

        const encerrarSorteioServices = new EncerrarSorteioServices();

        try{
            const response = await encerrarSorteioServices.execute(sorteioId);
            return res.status(200).json(response); //retorno um sucess
            
        }catch(error){
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }

}

export {EncerrarSorteioController}