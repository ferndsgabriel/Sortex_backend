import axios from "axios";

// Substitua pelos valores reais
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';


const getAccessToken = async (authCode: string) => {
    try {
    const response = await axios.post('https://api.mercadopago.com/oauth/token', null, {
        params: {
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: 'https://sortexbackend.vercel.app/sallercallback'  // Deve ser o mesmo URI usado para obter o auth code
    },
        auth: {
        username: '3875468438633898',
        password: 'eq3X60nI9yfXl2lixEIa6ITMfM7HbmYS'
        }
    });

    return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
    }
};



export default getAccessToken;