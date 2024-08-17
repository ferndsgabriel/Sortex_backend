import axios from 'axios';
import 'dotenv/config';

async function getAccessToken(authCode: string): Promise<string> {
    try {
        const response = await axios.post('https://api.mercadopago.com/oauth/token', {
            client_id:'3875468438633898',
            client_secret: 'eq3X60nI9yfXl2lixEIa6ITMfM7HbmYS',
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: `${process.env.BASE_URL}/sallercallback`
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Erro ao obter o access_token:', error.response?.data || error.message);
        throw error;
    }
}

export default getAccessToken;
