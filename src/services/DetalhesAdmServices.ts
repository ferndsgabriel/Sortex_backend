import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { Types } from "mongoose";

interface queryProps {
    _id: Types.ObjectId;
    name: string;
    email: string;
    photo: string;
    sub: string;
    __v: number; 
} // tipando os dados que recebo do meu db

class DetalhesAdmServices{
    async execute(id:string){
        if (!id){
            throw new Error ('Id não enviado');
        } //verifico se estou recebendo um id
        
        const admModel = mongoose.model('Administrador', admSchema); // crrio um model da minha tabela adm

        const obterAdm : queryProps | null = await admModel.findById(id); // verifico se existe um adm com o id pasado

        if (!obterAdm){
            throw new Error ('Administrador não encontrado');
        } // se n existir retorno um erro

        return ({ // se passar retorno os dados recebidos
            name:obterAdm.name,
            email:obterAdm.email,
            photo:obterAdm.photo,
            id:obterAdm._id
        })
    }
}

export {DetalhesAdmServices}