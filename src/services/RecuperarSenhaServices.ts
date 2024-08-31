import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { recoverySchema } from "../schemas/recoverySchema";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

interface RecoveryProps{
    id:string,
    cod:string,
    pass:string    
}

class RecuperarSenhaServices{
    async execute({id, cod, pass}:RecoveryProps){

        if (!id || !cod || !pass){
            throw new Error ("Preencha todos os dados");
        }

        const admModel = mongoose.model('Administradores', admSchema);

        const procurarAdm = await admModel.findById(id);

        if (!procurarAdm){
            throw new Error ("Administrador não encontrado");
        }

        const codigoModel = mongoose.model('Codigos', recoverySchema);

        const procurarCodigo = await codigoModel.findOne({admRef:id});

        if (!procurarCodigo){
            throw new Error ("Código não encontrado")
        }

        if (cod !== procurarCodigo.cod){
            throw new Error ('Link inválido');
        }

        const onDay = new Date();

        onDay.setMinutes(onDay.getMinutes() - 20);

        if (onDay > procurarCodigo.period){
            throw new Error ('Link inválido');
        }

        const hashPass = await hash(pass, 8);

        const deletarCod = await codigoModel.deleteOne({admRef:id});

        const uid = randomUUID();
        
        const atualizarSenha = await admModel.findByIdAndUpdate(id,{$set:{password:hashPass, sessionToken:uid}}).catch((error)=>{
            console.log(error);
            throw new Error ('Erro ao atualizar senha')
        });

        return {ok:true};
    }
}

export {RecuperarSenhaServices}