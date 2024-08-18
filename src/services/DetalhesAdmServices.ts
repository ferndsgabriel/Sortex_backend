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
        
        const admModel = mongoose.model('Administradores', admSchema); // crrio um model da minha tabela adm

        const obterAdm:queryProps | any = await admModel.findById(id).catch(()=>{
            throw new Error ('Administrador não encontrado');
        }) // verifico se existe um adm com o id pasado


        return ({ // se passar retorno os dados recebidos
            name:obterAdm.name,
            email:obterAdm.email,
            photo:obterAdm.photo,
            id:obterAdm._id
        })
    }
}

export {DetalhesAdmServices}