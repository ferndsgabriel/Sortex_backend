import fetch from 'node-fetch';


interface authCodeProps {
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string,
    user_id: number,
    refresh_token: string,
    public_key: string,
    live_mode: boolean
}

const getAccessToken = async (authCode:string) => {
    try {
        const response = await fetch('https://api.mercadopago.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: '3875468438633898',
                client_secret: 'eq3X60nI9yfXl2lixEIa6ITMfM7HbmYS',
                code: authCode,
                grant_type: 'authorization_code',
                redirect_uri: 'https://sortexbackend.vercel.app/sallercallback'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data : any  = await response.json();
        return data.access_token ;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
};

export default getAccessToken;
