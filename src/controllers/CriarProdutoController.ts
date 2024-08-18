import { Request, Response } from "express";
import { CriarProdutoServices } from "../services/CriarProdutoServices";

class CriarProdutoController {
    async handle(req: Request, res: Response) {

        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).json('Imagem não localizada!');
        } // verifico se estou recebendo um arquivo e se estou recebendo um array de arquivos

        let photos : any = []; //inicio um array vazio

        req.files.map((item:any)=>{
            photos.push(item.firebaseUrl);
        }) // intero os arquivos que tem no req.file e pego o firebaseUrl que é o endereço que minha foto que foi pro fb 

        if (photos.length === 0) {
            return res.status(400).json('Imagem não localizada!');
        } // verifico se tenho pelo menos uma foto

        const { name, description, price } = req.body; // os outros itens vou receber no body da requisição
        const id = req.adm_id; //pego o id atraves da tipagem que gerei o request, que recebe o id através do sub do token 

        const criarProdutoServices = new CriarProdutoServices(); // instancio o service

        try {
            const response = await criarProdutoServices.execute({
                name, description, price, photos:photos, id
            }); // faço um try e catch e retorno um sucesso ou erro
            return res.status(201).json(response);
        } catch (error) {
            return res.status(400).json({error:error.message});
        }
    }
}

export { CriarProdutoController };
