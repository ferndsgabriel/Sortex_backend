import { Request, Response } from "express";
import { CriarProdutoServices } from "../services/CriarProdutoServices";

class CriarProdutoController {
    async handle(req: Request, res: Response) {

        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).json('Imagem não localizada!');
        }

        const photos : any = [];

        req.files.map((item:any)=>{
            photos.push(item.firebaseUrl);
        })

        if (photos.length === 0) {
            return res.status(400).json('Imagem não localizada!');
        }

        const { name, description, price } = req.body;
        const id = req.adm_id;

        const criarProdutoServices = new CriarProdutoServices();

        try {
            const response = await criarProdutoServices.execute({
                name, description, price, photos:photos, id
            });
            return res.status(201).json(response);
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }
}

export { CriarProdutoController };
