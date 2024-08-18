import axios from 'axios';

const clientId = process.env.MERCADO_PAGO_CLIENT_ID;
const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET;
const redirectUri = `${process.env.BASE_URL}/sallercallback`;


const getAccessToken = async (authCode:string) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/oauth/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: authCode,
            grant_type: 'client_credentials',
            redirect_uri: redirectUri
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const acessToken =  response.data.access_token;
        return acessToken
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default getAccessToken