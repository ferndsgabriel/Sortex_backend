import "dotenv/config";
import { admSchema } from "../schemas/admSchema";
import mongoose, {Types} from "mongoose";

interface queryProps {
    _id: Types.ObjectId;
    name: string;
    email: string;
    photo: string;
    sub: string;
    __v: number; 
} // tipando os dados que recebo do meu db

class GerarLinkSallerServices {
    async execute(id:string) {

        // essa rota é o primeira passo para salvar o acess token que permite realizar compras no cartão do adm
        // basicamente existe um link pré definido pelo o mp e preciso passar alguns parametros voltados para a indentificar minha aplicação
        // tambem passo o id, pois vou usa-lo para criar um registro da conta do adm no db
        // proximo passo em mercadopago/getSaller;

        if (!id){
            throw new Error ("Id não encontrado")
        }

        const admModel = mongoose.model('Administradores', admSchema); // crrio um model da minha tabela adm

        const obterAdm : queryProps | null = await admModel.findById(id); // verifico se existe um adm com o id pasado

        if (!obterAdm){
            throw new Error ('Administrador não encontrado');
        } // se

        const baseUrl = 'https://auth.mercadopago.com.br/authorization?'; 
        const clientId = `client_id=${process.env.MERCADO_PAGO_CLIENT_ID}`;
        const body = '&response_type=code&platform_id=mp&';
        const redirect = `redirect_uri=${process.env.BASE_URL}/sallercallback`;
        const idReq = `&state=${id}`;

        const result = `${baseUrl}${clientId}${body}${redirect}${idReq}` as string;

        return ({url:result});
    
    }
}

export { GerarLinkSallerServices };
