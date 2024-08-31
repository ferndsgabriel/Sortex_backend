import mongoose, { Types } from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { compare, hash } from "bcryptjs";
import { randomUUID } from "crypto";

interface AtualizarProps{
    sub:string;
    email:string;
    name:string;
    photo:string;
    id:string;
}

interface admProps{
    sub:string;
    email:string;
}

class AtualizarDadosServices{
    async execute({sub, email, name, photo, id}:AtualizarProps){

        if (!(sub || email || name || photo || id)){
            throw new Error("Preencha todos os campos");
        } 

        const admModel = mongoose.model("Administradores", admSchema);

        const procurarAdm:admProps = await admModel.findById(id);

        if (!procurarAdm){
            throw new Error ('Administrador não encontrado');
        }

        const compararSub = await compare(sub, procurarAdm.sub);

        if (!compararSub){
            throw new Error ("Conta inválida");
        }

        const formatEmail = email.toLowerCase().trim();


        if (formatEmail !==  procurarAdm.email){
            throw new Error ("Conta inválida");
        } 

        await admModel.findByIdAndUpdate(id, {$set:{name:name, photo:photo}});

        return {ok:true};
    }
}

export {AtualizarDadosServices}