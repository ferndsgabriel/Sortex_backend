import axios from 'axios';
import "dotenv/config";

const accessToken = process.env.MERCADO_PAG0_ACCESS_TOKEN;

const AxiosVerificarPagameto = async (paymentId: string) => {
    const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export default AxiosVerificarPagameto;
