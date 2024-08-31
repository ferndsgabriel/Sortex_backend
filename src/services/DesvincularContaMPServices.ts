import mongoose from "mongoose";
import { cardSchema } from "../schemas/cartaoSchema";
import { sorteioSchema } from "../schemas/sorteioShema";

class DesvincularContaMPServices{
    async execute(id:string){

        if (!id){
            throw new Error ('Id não enviado');
        }

        const cardsModel = mongoose.model('Cartaos', cardSchema);

        const procurarConta = await cardsModel.findOne({admRef:id});

        if (!procurarConta){
            throw new Error ('Erro ao desvincular conta');
        }

        const sorteioModel = mongoose.model('Sorteios', sorteioSchema);

        const procurarSorteioAberto = await sorteioModel.findOne({admRef:id, status:false, drawn:false});

        if (procurarSorteioAberto){
            throw new Error ('Um sorteio vinculado a essa conta esta em andamento');
        }

        await cardsModel.findOneAndDelete({admRef:id}).catch(()=>{
            throw new Error ("Erro ao desvincular conta");
        });


        return {ok:true}

    }
}

export {DesvincularContaMPServices}