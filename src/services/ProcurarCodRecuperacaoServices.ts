import mongoose from "mongoose";
import { recoverySchema } from "../schemas/recoverySchema";

interface CodProps{
    cod:string;
    id:string
}

class ProcurarCodRecuperacaoServices{
    async execute({cod, id}:CodProps){

        if (!cod || !id){
            throw new Error('Envie todos os dados');
        }

        const codigoModel = mongoose.model('codigos', recoverySchema);

        const procurarCodigo = await codigoModel.findOne({admRef:id, cod:cod});

        if (!procurarCodigo){
            throw new Error('Código não encontrado');
        }

        
        const onDay = new Date();

        onDay.setMinutes(onDay.getMinutes() - 20);

        if (onDay > procurarCodigo.period){
            throw new Error ('Link inválido');
        }


        return {ok:true};
    }   
}
export {ProcurarCodRecuperacaoServices}