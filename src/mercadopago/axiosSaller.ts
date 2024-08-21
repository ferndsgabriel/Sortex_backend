import axios from 'axios';
import "dotenv/config";

const clientId = process.env.MERCADO_PAGO_CLIENT_ID as string;;
const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET as string;
const redirectUri = `${process.env.BASE_URL}/sallercallback`;


const axiosSaller = async (authCode: string) => {
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
        const accessToken = response.data.access_token;
        return accessToken;
    } catch (error:any) {
            const errors:any= {message:error.message, response:error.response}
            throw new Error(errors)
    }
};


export default axiosSaller