import { Request, Response } from "express";
import { GerarLinkSallerServices } from "../services/GerarLinkSallerServices";

class GerarLinkSallerController {
    async handle(req: Request, res: Response) {
        
        const id = req.adm_id; // id que recebo do request

        const gerarLinkSallerService = new GerarLinkSallerServices(); 

        try{
            const response = await gerarLinkSallerService.execute(id);
            return res.status(201).json(response); //retorno um sucess
            
        }catch(error){
            return res.status(400).json({error:error.message}); //retorno o erro
        }  // bem padrão e simples
    }
}

export { GerarLinkSallerController };
