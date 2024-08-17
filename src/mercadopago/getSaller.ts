import { Request, Response } from "express"
import getAccessToken from "./axiosToken";

class GetSaller{
    async handle(req:Request, res:Response){

        const authCode = req.query.code as string;  // onde vou receber o token gerado
        
        if (!authCode) {
            res.status(400).send('Código de autorização não encontrado.');
            return; // se n tiver um código quando eu chegar nessa rota, significa que o adm n viculou sua conta 
        }

        try {
            const accessToken = await getAccessToken(authCode); // Troca o authorization code pelo access token
            console.log(`Autorização completa! O access_token é: ${accessToken}`)
            res.send(`Autorização completa! O access_token é: ${accessToken}`);
        } catch (error) {
            console.error('Erro ao obter o access_token:', error);
            res.status(500).send(`Erro ao processar a autorização: ${error}`);
        }
    }
}

export {GetSaller}