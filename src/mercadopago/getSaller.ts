import { Request, Response } from 'express';
import getAccessToken from './axiosToken';
import { cardSchema } from '../schemas/cartaoSchema';
import mongoose from 'mongoose';

class GetSaller {
    async handle(req: Request, res: Response) {

        // essa função está vinculado a rota sallercallback, que é o redirect do adm após logar em sua conta do mp para poder receber os pagamentos
        
        const authCode = req.query.code as string; // recebo o token da requisição 
        const stateId = req.query.state as string; // recebo o id do user 

        if (!authCode) {
            res.status(400).json('Código de autorização não encontrado.');
            return;
        } // se n tiver o token.... 

        if (!stateId){
            res.status(400).json('Id não encontrado');
        } // se eu n receber o id...

        const accessToken =  await getAccessToken(authCode).then(); 
        //chamo o axios para gerar o acess token atraves do auth token
        // esse acesssToken é o responsavel por poder enviar pagamentos a conta do adm
        res.status(200).json(accessToken);
        
        if (!accessToken){
            res.status(400).json('Erro ao vincular conta');
        } // se eu n tenho um token...

        const cardModel = mongoose.model('Cartao', cardSchema); // crio um model de card

        const obterModels = await cardModel.find({admRef:stateId}); // verifico se meu adm possui uma cartão

        if (obterModels.length > 0){
            res.status(400).json('Você já possui uma conta vinculada');
        } // se ele tiver...
        
        const newCard = new cardModel({
            acessToken:accessToken,
            admRef:stateId
        }); // crio um novo card no db

        await newCard.save();

        return res.status(201).json('Conta vinculada com sucesso.');

    }
}

export { GetSaller };
