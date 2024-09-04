import { Request, Response } from "express";
import { ListarSorteiosAtivosServices } from "../services/ListarSorteiosAtivosServices";

class ListarSorteiosAtivosController {
    async handle(req: Request, res: Response) {
        const id = req.adm_id;
        
        // Captura parâmetros de consulta com req.query
        const per_page = req.query.per_page as string;
        const page = req.query.page as string;

        const listarSorteios = new ListarSorteiosAtivosServices(); 
        
        try {
            const response = await listarSorteios.execute({ id, per_page, page });
            return res.status(200).json(response); // Retorno sucesso
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Retorno erro
        }
    }
}

export { ListarSorteiosAtivosController };
