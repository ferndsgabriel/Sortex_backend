import { Request, Response } from 'express';
import axiosPayment from './axiosPayment';
import mongoose, { Schema, Document } from 'mongoose';
import { sorteioSchema } from '../schemas/sorteioShema';

interface Rifa {
    id: number;
    status: string;
    user: {
        name: string;
        email: string;
        whatsapp: string;
    };
}

interface SorteioProps extends Document {
    rifas: Rifa[];
}

class VerificarPagamento {
    async handle(req: Request, res: Response) {
        const { data } = req.body;
        const id = data.id;

        try {
            const response = await axiosPayment(id);
            const { status, metadata: { sorteio_id: sorteioId, user } } = response.data;

            const sorteioModel = mongoose.model('Sorteios', sorteioSchema);
            const procurarSorteio = await sorteioModel.findById<SorteioProps>(sorteioId).exec();

            if (!procurarSorteio) {
                return res.status(400).json('Sorteio não encontrado');
            }

            let updatedRifas = [...procurarSorteio.rifas]; // Copia a lista atual de rifas

            const rifaIndex = updatedRifas.findIndex((rifa: Rifa) => rifa.id.toString() === id.toString());

            if (rifaIndex === -1) {
                const newRifa = { id, status, user };
                updatedRifas.push(newRifa);
                console.log('Nova rifa adicionada com sucesso');
            } else {
                if (status == 'approved') {
                    updatedRifas[rifaIndex].status = status;
                } else if (['cancelled', 'refunded', 'charged_back'].includes(status)) {
                    updatedRifas.splice(rifaIndex, 1); // Remove a rifa do array se o status for negativo
                }
                console.log(`Rifa atualizada com sucesso, status: ${status}`);
            }

            // Atualiza a lista de rifas no banco de dados
            procurarSorteio.rifas = updatedRifas;
            await procurarSorteio.save();

            res.status(200).json('Status da rifa atualizado com sucesso');

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Erro ao verificar o pagamento' });
        }
    }
}

export { VerificarPagamento };
