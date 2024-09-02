import { produtoSchema } from "../schemas/produtoSchema"
import mongoose from "mongoose"

class ProdutoDetalhesServices{
    
    async execute(id:string){

        if (!id){
            throw new Error ('Envie um id');
        } // mando um erro se n tiver um id

        const produtosModel = mongoose.model('Produtos', produtoSchema); //obtenho a model de produtos

        const procurarProduto = await produtosModel.findById(id);

        return procurarProduto //retorno todos os produtos
    }
}

export {ProdutoDetalhesServices}