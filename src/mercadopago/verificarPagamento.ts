import { Request, Response } from 'express';
import axiosPayment from './axiosPayment';
import mongoose, { Schema, Document } from 'mongoose';
import { sorteioSchema } from '../schemas/sorteioShema';

interface RifaProps {
    id: number; // ou string, dependendo do tipo real
    status: string;
    user: {
        name: string;
        email: string;
        whatsapp: string;
    };
}

interface SorteioProps extends Document {
    rifas: RifaProps[];
    status: boolean;
}


class VerificarPagamento {
    async handle(req: Request, res: Response) {

        // esse é a rota onde o webhoock do mp vai retorna os dados de pagamentos que tiver status alterados

        const { data } = req.body; // pego tudo que tem no data que recebo desse webkoock

        const id = data.id.toString(); //pego o id do obj data 
    
        try {
            const response = await axiosPayment(id); // executo um endpoint do mp que devolve todas as informações da compra através do id
            
            const { status, metadata: { sorteio_id: sorteioId, user } } = response.data;
            // pego informações desse endpoint que vou precisar usar

            const sorteioModel = mongoose.model<SorteioProps>('Sorteios', sorteioSchema); // crio um model de sorteio
            
            // Buscar o sorteio
            const procurarSorteio = await sorteioModel.findById(sorteioId).exec(); // verifico se o id do sorteio que peguei na resposta do endpoint existe no db
    
            if (!procurarSorteio) {
                return res.status(400).json('Sorteio não encontrado');
            } // se n existir...
    
            // Verificar se rifas existe e é um array
            if (!Array.isArray(procurarSorteio.rifas)) {  
                return res.status(400).json('Rifas não é um array');
            } 
            // Verificar se rifas existe e é um array

            let updatedRifas: RifaProps[] = []; // crio uma list 
    
            procurarSorteio.rifas.forEach((item) => {
                if (item.id.toString() === id.toString()) {
                    const updateUser: RifaProps = {
                        id: item.id,
                        user: user,
                        status: status
                    }
                    updatedRifas.push(updateUser);
                } else {
                    updatedRifas.push(item);
                }
            }); // vou dando um push em updatedRifas ao mesmo tempo que vou verificando todas que contem o id de pagamento
            // que sofreu alteração, obs: mais de uma rifa pode sofrer alteração, pois se ele comprou 4 rifas e o pagamento foi
            // na mesma transação, todas vão conter o mesmo id de pagamento
    
            await sorteioModel.updateOne({ _id: sorteioId }, { $set: { rifas: updatedRifas} }); // dou um update no db 
            console.log('Status da rifa atualizado com sucesso');
            return res.status(200).json('Status da rifa atualizado com sucesso');
    
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Erro ao verificar o pagamento' });
        }
    }
    
    
}

export { VerificarPagamento };
