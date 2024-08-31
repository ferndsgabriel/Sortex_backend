import { Request, Response } from "express";
import { DeletarSocialMediaServices } from "../services/DeletarSocialMediaServices";

class DeletarSocialMediaController{
    async handle(req:Request, res:Response){
        
        const {id} = req.body;

        const deleteSocial = new DeletarSocialMediaServices();

        try {
            const response = await deleteSocial.execute({id});
            return res.status(204).json(response); //retorno um sucess
        } catch (error) {
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }   
}

export {DeletarSocialMediaController};

