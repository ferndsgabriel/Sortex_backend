import mongoose, { Types } from "mongoose";
import { sorteioSchema } from "../schemas/sorteioShema";
import AxiosVerificarPagameto from "../mercadopago/axiosVerificarPagameto";

/*interface sorteioProps {
    rifas: [{
        id: number,
        status: string,
        user: {
            name: string,
            whatsapp: string,
            email: string
        }
    }]
}*/

interface sorteioProps{
    dataTermino:Date,
    status:boolean
}

class AlterarStatusRifaServices {
    async execute(id:string, status:boolean) {

        if (!id){
            throw new Error('Id não enviado');
        } //

        const sorteioModel = mongoose.model<sorteioProps>('Sorteios', sorteioSchema);
        const procurarSorteio = await sorteioModel.findById(id).exec();
        
        if (!procurarSorteio) {
            throw new Error('Sorteio não encontrado');
        }

        const onDay = new Date();

        if (status === true &&   procurarSorteio.dataTermino <= onDay){
            throw new Error ('Altere a data de término do sorteio');
        }

        /*
        let aprovados: any[] = [];
        const analisar = procurarSorteio.rifas.map(async (item) => {
            const id = item.id.toString();
            const response = await AxiosVerificarPagameto(id);
            
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
        */
    
        await sorteioModel.updateOne({ _id: id }, { $set: {status: status } }).then(() => {
            return {ok:true}
        }).catch((error) => {
            console.log(error);
            return error;
        });
    }
}

export { AlterarStatusRifaServices }
