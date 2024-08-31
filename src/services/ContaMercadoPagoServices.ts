import mongoose from "mongoose";
import { cardSchema } from "../schemas/cartaoSchema";

class ContaMercadoPagoServices{
    async execute(id:string){

        if (!id){
            throw new Error('Id não enviado');
        }

        const contaModel = mongoose.model('cartaos', cardSchema);

        const procurarConta = await contaModel.findOne({admRef:id});

        if (!procurarConta){
            throw new Error("Cartão não vinculado");
        }

        return procurarConta._id;
    }
}
export {ContaMercadoPagoServices}