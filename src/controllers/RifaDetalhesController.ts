import { Request, Response } from "express";
import { RifaDetalhesServices } from "../services/RifaDetalhesServices";

class RifaDetalhesController {
    async handle(req: Request, res: Response) {
        
        const id = req.query.id as string;

        const detalhesRifa = new RifaDetalhesServices(); 
    
        try {
            const response = await detalhesRifa.execute(id);
            return res.status(200).json(response); // Retorno sucesso
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Retorno erro
        }
    }
}

export { RifaDetalhesController };
