import axios from 'axios';
import "dotenv/config";

const accessToken = 'APP_USR-3875468438633898-081711-c309e7f4bcf3481cac8562b69a9869b4-247395576'

const axiosPayment = async (paymentId: string) => {
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

export default axiosPayment;
