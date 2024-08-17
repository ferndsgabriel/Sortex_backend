import axios from 'axios';

// Substitua pelos valores reais
const clientId = '3875468438633898';
const clientSecret = 'eq3X60nI9yfXl2lixEIa6ITMfM7HbmYS';

const getAccessToken = async (authCode: string) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: 'https://sortexbackend.vercel.app/sallercallback'
            },
            auth: {
                username: clientId,
                password: clientSecret
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;  // Re-throw the error to be caught in the caller
    }
};

export default getAccessToken;
