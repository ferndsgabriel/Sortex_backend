import axios from 'axios';
import 'dotenv/config';

async function getAccessToken(authCode: string): Promise<string> {
    try {
        const response = await axios.post('https://api.mercadopago.com/oauth/token', {
            client_id: process.env.MERCADO_PAGO_CLIENT_ID,
            client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: `${process.env.BASE_URL}/sallercallback` 
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Erro ao obter o access_token:', error);
        throw error;
    }
}

export default getAccessToken
