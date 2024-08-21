import { MercadoPagoConfig, OAuth } from 'mercadopago';



async function AtualizarAcessToken(refreshToken:string, access_token:string) {

    const client_id = process.env.MERCADO_PAGO_CLIENT_ID as string;
    const client_secret = process.env.MERCADO_PAGO_CLIENT_SECRET as string;

    const client = new MercadoPagoConfig({ accessToken: access_token, options: { timeout: 5000 } });
    const oauth = new OAuth(client);

    try{
        const response = await oauth.refresh({
            body:{
                client_secret:client_secret,
                client_id:client_id,
                refresh_token:refreshToken
            }
        });
        const data = {
            accesstoken: response.access_token,
            refreshToken:response.refresh_token,
        }
        return data
    }catch(error){
        return error
    }

}

export default AtualizarAcessToken
