import axios from 'axios';
import 'dotenv/config';

async function getAccessToken(authCode: string): Promise<string> {
    try {
        const response = await axios.post('https://auth.mercadopago.com.br/authorization?client_id=3875468438633898&response_type=code&platform_id=mp&redirect_uri=https://sortexbackend.vercel.app/sallercallback')

        return response.data.access_token;
    } catch (error) {
        console.error('Erro ao obter o access_token:', error.response?.data || error.message);
        throw error;
    }
}

export default getAccessToken;
