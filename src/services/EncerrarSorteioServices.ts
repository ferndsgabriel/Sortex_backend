import mongoose, { Types } from "mongoose";
import { sorteioSchema } from "../schemas/sorteioShema";

class EncerrarSorteioServices{

    async execute(sorteioId:Types.ObjectId){

        if (!sorteioId){
            throw new Error ('Digite o id do sorteio');
        }

        const sorteioModel = mongoose.model('Sorteios', sorteioSchema);

        const procurarSorteio = await sorteioModel.findById(sorteioId);

        if (!procurarSorteio){
            throw new Error ('Sorteio não encontrado')
        }


        if (procurarSorteio.status){
            throw new Error ('Finalize primeiro as rifas');
        }

        const finalizarSorteio = sorteioModel.findByIdAndUpdate(sorteioId,{$set:{drawn:false, status:false}}).catch((error)=>{
            console.log(finalizarSorteio);
            throw new Error ("Erro ao finalizar sorteio");
        })

        return 'Sorteio finalizado com sucesso porra';

    }

}

export {EncerrarSorteioServices}