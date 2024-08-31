import mongoose, { Types } from "mongoose";
import { socialSchema } from "../schemas/socialSchema";

interface socialId {
    id:Types.ObjectId | string
}

class DeletarSocialMediaServices{
    async execute({id}:socialId){

        if (!id){
            throw new Error ('Id não enviado');
        }
        
        const socialModel = mongoose.model('Sociais', socialSchema);

        const procurarSocial = await socialModel.findById(id);

        if (!procurarSocial){
            throw new Error ("Rede social não encontrada");
        }

        const response = await socialModel.findByIdAndDelete(id).catch((error)=>{
            console.log(error);
            throw new Error ('Erro ao deletar rede social');
        })

        return response;
    }
}
export {DeletarSocialMediaServices}