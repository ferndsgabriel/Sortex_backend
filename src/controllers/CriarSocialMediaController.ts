import { Request, Response } from "express";
import { CriarSocialMediaServices } from "../services/CriarSocialMediaServices";

class CriarSocialMediaController{
    async handle (req:Request, res:Response){
        const { youtube, twitch, tiktok, instagram} = req.body;
        const adm = req.adm_id;

        const criarSocialMedia = new CriarSocialMediaServices();
        
        try {
            const response = await criarSocialMedia.execute({adm,  youtube, twitch, tiktok, instagram});
            return res.status(201).json(response); //retorno um sucess
        } catch (error) {   
            return res.status(400).json({error:error.message}); //retorno o erro
        }
    }
}

export {CriarSocialMediaController}