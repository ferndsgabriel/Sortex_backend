import { Request, Response } from "express"
import getAccessToken from "./axiosToken";

class GetSaller{
    async handle(req:Request, res:Response){

        const authCode = req.query.code as string;  // onde vou receber o token gerado
        
        if (!authCode) {
            res.status(400).send('Código de autorização não encontrado.');
            return; // se n tiver um código quando eu chegar nessa rota, significa que o adm n viculou sua conta 
        }
        console.log(authCode)
    }
}

export {GetSaller}