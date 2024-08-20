import mongoose, { Types } from "mongoose";
import { sorteioSchema } from "../schemas/sorteioShema";
import axiosPayment from "../mercadopago/axiosPayment";

interface sorteioProps {
    rifas: [{
        id: number,
        status: string,
        user: {
            name: string,
            whatsapp: string,
            email: string
        }
    }]
}

class FinalizarSorteioServices {
    async execute(id: Types.ObjectId) {

        if (!id){
            throw new Error('Id não enviado');
        } //

        const sorteioModel = mongoose.model<sorteioProps>('Sorteios', sorteioSchema);
        const procurarSorteio = await sorteioModel.findById(id).exec();
        
        if (!procurarSorteio) {
            throw new Error('Sorteio não encontrado');
        }

        let aprovados: any[] = [];

        const analisar = procurarSorteio.rifas.map(async (item) => {
            const id = item.id.toString();
            const response = await axiosPayment(id);
            
            const status = response.data.status;

            if (status === 'approved') {
                const pushUser = {
                    id: item.id,
                    user: item.user,
                    status: 'approved'
                };
                aprovados.push(pushUser);
            }
        });

        // Aguardando todas as Promises serem resolvidas
        await Promise.all(analisar);

        await sorteioModel.updateOne({ _id: id }, { $set: { rifas: aprovados, status: false } }).then(() => {
            console.log(aprovados);
            return aprovados;
        }).catch((error) => {
            console.log(error);
            return error;
        });
    }
}

export { FinalizarSorteioServices }
