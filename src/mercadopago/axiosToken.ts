import axios from 'axios';

const clientId = '3875468438633898';
const clientSecret = 'eq3X60nI9yfXl2lixEIa6ITMfM7HbmYS';


const getAccessToken = async (authCode: string) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/oauth/token', {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type:'authorization_code',
            redirect_uri: 'https://sortexbackend.vercel.app/sallercallback'
        }, {
            headers: {
                'Content-Type': 'Content-Type: application/json'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error to be caught in the caller
    }
};

export default getAccessToken;
