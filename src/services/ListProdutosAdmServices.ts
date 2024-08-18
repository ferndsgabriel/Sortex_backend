import { produtoSchema } from "../schemas/produtoSchema"
import mongoose from "mongoose"

class ListProdutosAdmServices{
    
    async execute(id:string){

        if (!id){
            throw new Error ('Envie um id');
        } // mando um erro se n tiver um id

        const produtosModel = mongoose.model('Produtos', produtoSchema); //obtenho a model de produtos
        const findAll = produtosModel.find({admRef: id}).sort({name: 1}); // busco todos os produtos que tenho o adm como ref

        return findAll //retorno todos os produtos
    }
}

export {ListProdutosAdmServices}