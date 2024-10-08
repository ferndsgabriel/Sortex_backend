import axios from 'axios';
import "dotenv/config";

const clientId = process.env.MERCADO_PAGO_CLIENT_ID as string;;
const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET as string;
const redirectUri = `${process.env.BASE_URL}/sallercallback`;


const AxiosAcessToken = async (authCode: string) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/oauth/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: authCode,
            grant_type: 'authorization_code',  
            redirect_uri: redirectUri
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};


export default AxiosAcessToken