import axios from 'axios';
import qs from 'qs';  // Biblioteca para serializar dados em formato URL-encoded

const clientId = '3875468438633898';
const clientSecret = 'eq3X60nI9yfXl2lixEIa6ITMfM7HbmYS';

const getAccessToken = async (authCode: string) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/oauth/token', qs.stringify({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: 'https://sortexbackend.vercel.app/sallercallback'
        }), {
            auth: {
                username: clientId,
                password: clientSecret
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;  // Re-throw the error to be caught in the caller
    }
};

export default getAccessToken;
