import mongoose, { Types } from "mongoose";
import { produtoSchema } from "../schemas/produtoSchema";
import { DeleteImage } from "../middlewares/FirebaseMiddlewara";

interface ProductsProps{
    name:string;
    description:string;
    _id:Types.ObjectId;
    photos:[];
}


class DeletarProdutoServices{
    async execute(id:string){

        if (!id){
            throw new Error ('Id não encontrado');
        }

        const produtoModel = mongoose.model('Produtos', produtoSchema);

        const procurarProduto:ProductsProps = await produtoModel.findById(id);

        if (!procurarProduto){
            throw new Error ('Produto não encontrado');
        }

        
        const deletePromises = procurarProduto.photos.map(item => 
            DeleteImage(item)
                .then(() => {
                    console.log(`Foto deletada com sucesso: ${item}`);
                })
                .catch(error => {
                    console.error(`Erro ao deletar foto: ${item}`, error);
                })
        );

        await Promise.all(deletePromises);
        
        await produtoModel.findByIdAndDelete(id).catch(()=>{
            throw new Error ("Erro ao deletar");
        })

        return {ok:true};
    }
}

export {DeletarProdutoServices}