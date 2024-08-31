import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { socialSchema } from "../schemas/socialSchema";

class ListarRedesSociaisServices{
    async execute(id:string){

        if (!id){
            throw new Error ('Id do administrador não encontrado');
        }

        const admModel = mongoose.model('Administradores', admSchema);

        const procurarAdm = await admModel.findById(id);

        if (!procurarAdm){
            throw new Error ("Administrador não encontrado");
        }

        const sociaisModel = mongoose.model('Sociais', socialSchema);

        const procurarSociais = await sociaisModel.findOne({admRef:id}).catch((error)=>{
            console.log(error);
            throw new Error ('Erro ao encontrar redes sociais');
        });

        return procurarSociais;
    }
}
export {ListarRedesSociaisServices};