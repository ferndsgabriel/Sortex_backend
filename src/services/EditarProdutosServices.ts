import mongoose, {Types} from "mongoose";
import { produtoSchema } from "../schemas/produtoSchema";
import { DeleteImage } from "../middlewares/FirebaseMiddlewara";
import { AxiosError } from "axios";

interface ProductsProps{
    id:string;
    oldPhotos?:[];
    photos?:[];
    name:string;
    description:string;
}

interface ProductsDB{
    name:string;
    description:string;
    _id:Types.ObjectId;
    photos:[];
}

class EditarProdutosServices {
    async execute({id, photos, name, description, oldPhotos}: ProductsProps) {
        
        if (!id) {
            throw new Error('Preencha todos os campos');
        }

        const produtoModel = mongoose.model('Produtos', produtoSchema);

        const procurarProduto: ProductsDB = await produtoModel.findById(id);

        if (!procurarProduto) {
            throw new Error('Produto não encontrado');
        }

        const sendPhotos = photos.concat(oldPhotos);

        await produtoModel.findByIdAndUpdate(id, {
            $set: {
                name: name,
                description: description,
                photos:sendPhotos
            }
        }).catch((error:AxiosError | any) => {
            throw new Error("Erro ao atualizar produto");
        });
        

        return {ok:true}
    }
}

export {EditarProdutosServices}