import mongoose from "mongoose";
import { produtoSchema } from "../schemas/produtoSchema";
import { admSchema } from "../schemas/admSchema";

interface produtoProps{
    name:string,
    description:string,
    price:number,
    photos:[],
    id:string
}


class CriarProdutoServices{
    async execute({name, description, price, photos, id}:produtoProps){
        
        if (!name ||  !description ||  !price  || !id){
            throw new Error ('Digite todos os campos.');
        }

        if (name.length < 2){
            throw new Error ("Digite um nome válido.")
        }
        
        if (photos.length < 1){
            throw new Error ('Envie pelo menos uma foto do produto');
        }

        const produtoModel = mongoose.model("Produtos", produtoSchema);

        const admModel = mongoose.model('Administrador', admSchema);

        const obterAdm = await admModel.findById(id);

        if (!obterAdm){
            throw new Error ('Administrador não encontrado');
        }

        const criarProduto = new produtoModel({
            name,
            description,
            photos,
            price,
            userRef:id
        });

        const response = await criarProduto.save();
        
        return response

    }
}

export{CriarProdutoServices}