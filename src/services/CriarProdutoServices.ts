import mongoose from "mongoose";
import { produtoSchema } from "../schemas/produtoSchema";
import { admSchema } from "../schemas/admSchema";

interface produtoProps{
    name:string,
    description:string,
    photos:[],
    id:string 
}


class CriarProdutoServices{
    async execute({name, description, photos, id}:produtoProps){
        
        if (!name ||  !description || !id){
            throw new Error ('Digite todos os campos.');
        } // verifico se recebo itens

        if (name.length < 2){
            throw new Error ("Digite um nome válido.")
        } // n quero um produto com apenas 2 caracteres no nome
        
        if (photos.length < 1){
            throw new Error ('Envie pelo menos uma foto do produto');
        } // tem que ter pelo menos uma foto

        const admModel = mongoose.model('Administradores', admSchema); //inicio o model de adm, pois produto tem adm como chave secundaria

        const obterAdm = await admModel.findById(id);   // verifico se tenho o adm
    
        if (!obterAdm){
            throw new Error ('Administrador não encontrado');
        } // se n tiver o adm

        const produtoModel = mongoose.model("Produtos", produtoSchema); //inicio o model de produtos

        const criarProduto = new produtoModel({
            name,
            description,
            photos,
            admRef:id
        }); // passou por tudo posso criar o produto

        const response = await criarProduto.save().catch(()=>{
            throw new Error ('Administrador não encontrado');
        })
        
        return response

    }
}

export{CriarProdutoServices}