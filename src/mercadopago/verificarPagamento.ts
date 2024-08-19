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
        const { data } = req.body;
        const id = data.id.toString();
    
        try {
            const response = await axiosPayment(id);
            const { status, metadata: { sorteio_id: sorteioId, user } } = response.data;
    
            const sorteioModel = mongoose.model<SorteioProps>('Sorteios', sorteioSchema);
            
            // Buscar o sorteio
            const procurarSorteio = await sorteioModel.findById(sorteioId).exec();
    
            if (!procurarSorteio) {
                return res.status(400).json('Sorteio não encontrado');
            }
    
            // Verificar se rifas existe e é um array
            if (!Array.isArray(procurarSorteio.rifas)) {
                return res.status(400).json('Rifas não é um array');
            }
    
            let updatedRifas: RifaProps[] = [];
    
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
            });
    
            await sorteioModel.updateOne({ _id: sorteioId }, { $set: { rifas: updatedRifas} });
            console.log('Status da rifa atualizado com sucesso');
            res.status(200).json('Status da rifa atualizado com sucesso');
    
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Erro ao verificar o pagamento' });
        }
    }
    
    
}

export { VerificarPagamento };
