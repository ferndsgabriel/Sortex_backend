import { Request, Response } from 'express';
import getAccessToken from './axiosToken';

class GetSaller {
    async handle(req: Request, res: Response) {
        const authCode = req.query.code as string;

        if (!authCode) {
            res.status(400).send('Código de autorização não encontrado.');
            return;
        }

        await getAccessToken(authCode).then((sucess)=>{
            return res.json(sucess)
        }).catch((error)=>{
            return res.json(error);
        })
    }
}

export { GetSaller };
