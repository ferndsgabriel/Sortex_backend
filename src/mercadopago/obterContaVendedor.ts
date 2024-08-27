import { Request, Response } from 'express';
import { cardSchema } from '../schemas/cartaoSchema';
import mongoose from 'mongoose';
import AxiosAcessToken from './axiosAcessToken';

class ObterContaVendedor {
    async handle(req: Request, res: Response) {

        // essa função está vinculado a rota sallercallback, que é o redirect do adm após logar em sua conta do mp para poder receber os pagamentos
        const authCode = req.query.code as string; // recebo o token da requisição 
        const stateId = req.query.state as string; // recebo o id do user 

        if (!authCode) {
            res.status(400).json('Código de autorização não encontrado.');
        } // se n tiver o token.... 

        if (!stateId){
            res.status(400).json('Id não encontrado');
        } // se eu n receber o id...

        const obterAcessToken = await AxiosAcessToken(authCode).catch(()=>{
            res.status(400).json('Erro ao obter acess token')
        })
        
        const accessToken = obterAcessToken.access_token; // pego o acess token da responsa do axios
        const refreshToken = obterAcessToken.refresh_token; // pego o refresh token tbm

        const cardModel = mongoose.model('Cartaos', cardSchema); // crio um model de card

        const obterModels = await cardModel.find({admRef:stateId}); // verifico se meu adm possui uma cartão

        if (obterModels.length > 0){
            res.status(400).json('Você já possui uma conta vinculada');
        } // se ele tiver...
        
        const newCard = new cardModel({
            accessToken:accessToken,
            refreshToken:refreshToken,
            admRef:stateId
        }); // crio um novo card no db e salvo o refresh token e o acess token

        await newCard.save();

        return res.status(201).json('Conta vinculada com sucesso.');

    }
}

export { ObterContaVendedor };
