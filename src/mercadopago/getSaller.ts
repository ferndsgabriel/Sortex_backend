import { Request, Response } from 'express';
import axiosSaller from './axiosSaller';
import { cardSchema } from '../schemas/cartaoSchema';
import mongoose from 'mongoose';

class GetSaller {
    async handle(req: Request, res: Response) {

        // essa função está vinculado a rota sallercallback, que é o redirect do adm após logar em sua conta do mp para poder receber os pagamentos
        console.log('fui chamada')
        const authCode = req.query.code as string; // recebo o token da requisição 
        const stateId = req.query.state as string; // recebo o id do user 

        if (!authCode) {
            res.status(400).json('Código de autorização não encontrado.');
        } // se n tiver o token.... 

        if (!stateId){
            res.status(400).json('Id não encontrado');
        } // se eu n receber o id...

        const cardModel = mongoose.model('Cartaos', cardSchema); // crio um model de card

        const obterModels = await cardModel.find({admRef:stateId}); // verifico se meu adm possui uma cartão

        if (obterModels.length > 0){
            res.status(400).json('Você já possui uma conta vinculada');
        } // se ele tiver...
        
        const newCard = new cardModel({
            authCode:authCode,
            admRef:stateId
        }); // crio um novo card no db e salvo o authCode

        await newCard.save();
        //obs: passei a armazenar o auth token e gerar o acess token só na hora de gerar o link de compra, vi que é mais seguro
        // além de que o acess token pode expirar
        return res.status(201).json('Conta vinculada com sucesso.');

    }
}

export { GetSaller };
