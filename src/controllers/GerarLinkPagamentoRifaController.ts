import { Request, Response } from "express";
import { GerarLinkPagamentoRifaServices } from "../services/GerarLinkPagamentoRifaServices";

class GerarLinkPagamentoRifaController{
    async handle(req:Request, res:Response){

        const {sorteioId, metodoDePagamento, email, name, whatsapp} = req.body;

        const gerarLinkPagamentoRifaServices = new GerarLinkPagamentoRifaServices();
        
        try {
            const response = await gerarLinkPagamentoRifaServices.execute({
                sorteioId, metodoDePagamento, email, name, whatsapp 
            });
            
            return res.status(200).json(response);

        } catch (error) {
            return res.status(400).json({error:error.message});;
        }
    }   
}

export {GerarLinkPagamentoRifaController}