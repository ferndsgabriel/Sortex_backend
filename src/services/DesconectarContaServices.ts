import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { randomUUID } from "crypto";

class DesconectarContaServices{
    async execute(id:string){

        if (!id){
            throw new Error ("Id não enviado");
        }

        const admModel = mongoose.model("Administradores", admSchema);

        const procurarAdm = await admModel.findById(id);

        if (!procurarAdm){
            throw new Error ("Administrador não encontrado");
        }

        const newUid = randomUUID();

        const atualizarSession  = await admModel.findByIdAndUpdate(id, {$set:{sessionToken:newUid}}).catch((error)=>{
            throw new Error ('Erro ao atualizar session token');
        });

        return newUid;
    }
}

export {DesconectarContaServices}