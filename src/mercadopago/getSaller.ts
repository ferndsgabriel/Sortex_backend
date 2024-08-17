import { Request, Response } from 'express';
import getAccessToken from './axiosToken';

class GetSaller {
    async handle(req: Request, res: Response) {
        const authCode = req.query.code as string;

        if (!authCode) {
            res.status(400).send('Código de autorização não encontrado.');
            return;
        }

        try {
            const accessToken = await getAccessToken(authCode);
            console.log(`Autorização completa! O access_token é: ${accessToken}`);
            res.send(`Autorização completa! O access_token é: ${accessToken}`);
        } catch (error) {
            console.error('Erro ao obter o access_token:', error);
            res.status(500).send(`Erro ao processar a autorização: ${error.message}`);
        }
    }
}

export { GetSaller };
