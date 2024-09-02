import { Request, Response } from "express";
import { EditarProdutosServices } from "../services/EditarProdutosServices";


class  EditarProdutosController {
    async handle(req: Request, res: Response) {

        let photos : any = [];

        if (req.files && Array.isArray(req.files)) {
            //inicio um array vazio

        req.files.map((item:any)=>{
                photos.push(item.firebaseUrl);
            }) // intero os arquivos que tem no req.file e pego o firebaseUrl que é o endereço que minha foto que foi pro fb 
        } // verifico se estou recebendo um arquivo e se estou recebendo um array de arquivos

        const { name, description, oldPhotos } = req.body; // os outros itens vou receber no body da requisição
        const {id} = req.params;
        
        const editarProdutos = new EditarProdutosServices(); // instancio o service

        try {
            const response = await editarProdutos.execute({
                name, description, photos:photos, id, oldPhotos
            }); // faço um try e catch e retorno um sucesso ou erro
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json({error:error.message});
        }
    }
}

export {  EditarProdutosController };
