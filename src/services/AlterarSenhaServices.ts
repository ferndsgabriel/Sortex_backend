import mongoose, { Types } from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { compare, hash } from "bcryptjs";
import { randomUUID } from "crypto";

interface AlterarSenhaProps{
    id:Types.ObjectId | string;
    senhaAntiga:string;
    senhaNova:string;
}

interface admProps{
    password:string;
}

class AlterarSenhaServices{

    async execute({id, senhaAntiga, senhaNova}:AlterarSenhaProps){

        if (!(id || senhaAntiga || senhaNova)){
            throw new Error ("Preencha todos os campos");
        }

        const admModel = mongoose.model("Administradores", admSchema);

        const procurarAdm:admProps = await admModel.findById(id);

        if (!procurarAdm){
            throw new Error ('Administrador não encontrado');
        }

        const compararSenha = await compare(senhaAntiga, procurarAdm.password);

        const igual = await compare(senhaNova, procurarAdm.password);

        if (igual){
            throw new Error('Digite uma senha diferente da atual');
        }
        
        if (!compararSenha){
            throw new Error("Senha inválida");
        }

        const hashNewSenha = await hash(senhaNova, 8);

        const newUid = randomUUID();

        await admModel.findByIdAndUpdate(id, {$set:{password:hashNewSenha, sessionToken:newUid}}).catch((error)=>{
            console.log(error)
            throw new Error ('Erro ao alterar senha');
        })

        return newUid;

    }
}

export {AlterarSenhaServices};