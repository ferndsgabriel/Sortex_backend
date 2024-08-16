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
}

class DetalhesAdmServices{
    async execute(id:string){
        if (!id){
            throw new Error ('Id não enviado');
        }
        const admModel = mongoose.model('Administrador', admSchema);
        const obterAdm : queryProps | null = await admModel.findById(id);

        if (!obterAdm){
            throw new Error ('Administrador não encontrado');
        }

        return ({
            name:obterAdm.name,
            email:obterAdm.email,
            photo:obterAdm.photo,
            id:obterAdm._id
        })
    }
}

export {DetalhesAdmServices}