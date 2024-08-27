import "dotenv/config";
import { admSchema } from "../schemas/admSchema";
import mongoose, { Types } from "mongoose";

interface queryProps {
    _id: Types.ObjectId;
    name: string;
    email: string;
    photo: string;
    sub: string;
    __v: number;
} // tipando os dados que recebo do meu db

class GerarLinkSallerServices {
    async execute(id: string) {
        if (!id) {
            throw new Error("Id não encontrado");
        }
        
        const admModel = mongoose.model('Administradores', admSchema);
        const obterAdm: queryProps | null = await admModel.findById(id);

        if (!obterAdm) {
            throw new Error('Administrador não encontrado');
        }

        // Geração do link de autorização do Mercado Pago
        const baseUrl = 'https://auth.mercadopago.com.br/authorization?'; 
        const clientId = `client_id=${process.env.MERCADO_PAGO_CLIENT_ID}`;
        const responseType = '&response_type=code&platform_id=mp&';
        const redirect = `redirect_uri=${process.env.BASE_URL}/sallercallback`;
        const idReq = `&state=${id}`;

        const result = `${baseUrl}${clientId}${responseType}${redirect}${idReq}`;

        return { url: result };
    }
}

export { GerarLinkSallerServices };
