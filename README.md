### Sortex - Backend 
<style>
a {
  color:#2374b3;
}
.mini{
    font-size:12px;
}
</style>

<div>
    <h2>About 🚨</h2>
    <p>
        This project is designed to manage raffles, allowing products to be drawn through the sale of tickets.
    </p>
</div>

<div>
    <h2>Tools 🛠</h2>  
    <img src='https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white' alt='Node'/>
    <img src='https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white' alt='TypeScript'/>
    <img src='https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white' alt='MongoDB'/>
</div>

<br/>

```bash
# Clone the project
$ git clone https://github.com/ferndsgabriel/Sortex_backend.git

```bash
# Install dependencies
$ yarn install
```

```bash
# Start the project
$ yarn dev
```

```bash
# Start the project
$ yarn dev
```

```bash
# Start the project (if using npm)
$ npm run dev
```
<div> <h3> Workflow to Obtain Seller Access Token and Create PIX Payment with Split </h3> <h4>1 - Obtain the Access Token</h4> <ul> <li> Get the Mercado Pago credentials <a href='https://www.mercadopago.com.br/developers/pt/reference'>here</a>. </li> <li> Register a backend endpoint in "Redirect URLs" to receive the access token response. </li> </ul>
<h4>2 - Create a Template Link to Return in a Function</h4>

```javascript
const baseUrl = 'https://auth.mercadopago.com.br/authorization?'; 
const clientId = `client_id=${process.env.MERCADO_PAGO_CLIENT_ID}`;
const responseType = '&response_type=code&platform_id=mp&';
const redirect = `redirect_uri=${process.env.BASE_URL}/sallercallback`;
const idReq = `&state=${id}`;

const result = `${baseUrl}${clientId}${responseType}${redirect}${idReq}`;
```
<p>The parameters include:</p> <ul> <li>Client ID (Identify your application)</li> <li>Redirect (The backend endpoint that will receive the response)</li> <li>State (Additional information for the callback, in this case, the seller's ID)</li> </ul>

```javascript
routes.get('/sallercallback', new ObterContaVendedor().handle);
```

<p>The route to obtain the auth token, which is generated in the callback after the seller logs in.</p> <h4>4 - Obtain the Auth Token and Use Axios to Fetch the Access Token</h4>

```javascript
import { Request, Response } from 'express';
import { cardSchema } from '../schemas/cartaoSchema';
import mongoose from 'mongoose';
import AxiosAcessToken from './axiosAcessToken';

class ObterContaVendedor {
    async handle(req: Request, res: Response) {

        // This function is linked to the sallercallback route, which is the redirect after the admin logs into their Mercado Pago account to receive payments
        const authCode = req.query.code as string; // Get the authorization code from the request
        const stateId = req.query.state as string; // Get the user's ID from the request

        if (!authCode) {
            res.status(400).json('Authorization code not found.');
        } // If no token is found...

        if (!stateId){
            res.status(400).json('ID not found.');
        } // If no ID is found...

        const obterAcessToken = await AxiosAcessToken(authCode).catch(()=>{
            res.status(400).json('Error obtaining access token.');
        });
        
        const accessToken = obterAcessToken.access_token; // Get the access token from the Axios response
        const refreshToken = obterAcessToken.refresh_token; // Get the refresh token from the Axios response

        const cardModel = mongoose.model('Cartaos', cardSchema); // Create a card model

        const obterModels = await cardModel.find({admRef:stateId}); // Check if the admin already has a card

        if (obterModels.length > 0){
            res.status(400).json('You already have a linked account.');
        } // If the admin already has an account...

        const newCard = new cardModel({
            accessToken:accessToken,
            refreshToken:refreshToken,
            admRef:stateId
        }); // Create a new card in the database and save the tokens

        await newCard.save();

        return res.status(201).json('Account successfully linked.');
    }
}

export { ObterContaVendedor };
```

<p>In the callback function, I retrieve the ID and auth code from `req.query`. Using the auth code, I make a request to obtain the access and refresh tokens, which are then saved in the database.</p>

```javascript
import axios from 'axios';
import "dotenv/config";

const clientId = process.env.MERCADO_PAGO_CLIENT_ID as string;
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

export default AxiosAcessToken;
```

<p>This function retrieves the access token.</p> <h4>5 - Generate the Payment Link for the Buyer</h4> <p>Create a function that takes parameters to generate the payment link.</p>

```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { formatEmail } from '../utils/formats';

interface paymentProps{
	accessToken:string;
	amount:number;
	description:string;
	user:{
		name:string;
		email:string;
		whatsapp:string;
	};
	sorteioId:string;
	qtd:number;
}
	
async function ObterLinkPagamento({accessToken, amount, description, user, sorteioId, qtd}: paymentProps){

	const total = amount * qtd;

	const porcentagem = 3; 
	
	const valorPlataforma = total * (porcentagem / 100);

	const client = new MercadoPagoConfig({ accessToken:accessToken }); 

	const payment = new Payment(client);

	const body : any = {
		application_fee: valorPlataforma,
		transaction_amount: total,
		description: description,
		payment_method_id: 'pix',
		payer: {
			email: formatEmail(user.email),
			first_name: user.name.split(' ')[0], // Assumes first name
			last_name: user.name.split(' ')[1] 
		},
		metadata: {
			sorteioId: sorteioId,
			user: user
		},
	}; // Function body

    try {
        const success = await payment.create({ body });
        const transactionData = success.point_of_interaction.transaction_data;

        return {
			id: success.id,
            url: transactionData.ticket_url,
            status: success.status,  
            statusDetail: success.status_detail 
        };
    } catch (error) {
		console.log(error);
        throw (error.code);
    }
}

export default ObterLinkPagamento;

```

<p>Parameters needed to generate the payment link:</p> <ul> <li> AccessToken: The seller's access token for the payment to be credited to their account. </li> <li> Amount: Transfer amount. </li> <li> Description: Description of the purchase. </li> <li> User: Information about the buyer. </li> <li> SorteioId: The raffle ID the payment is associated with. </li> <li> Qtd: Quantity of products being purchased (the total is calculated as amount * qtd). </li> </ul> <b>!! You can choose to save the payment once it's confirmed by the webhook, but I preferred to save it when the link is generated.</b> <p>What I save when generating the link:</p> <ul> <li> Transaction ID </li> <li> Status (probably pending) </li> <li> Raffle ID </li> <li> Buyer information </li> </ul> <h4>6 - What We Need for the Split Payment</h4> <ul> <li>Application Fee</li> </ul> <p>In the function that generates the link, I calculated a percentage that will go to the platform, and the application fee is how you configure the fee in the request body. It's a percentage of the total.</p> <h4>7 - Validate the Payment in the Webhook</h4>

```javascript
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PaySchema } from '../schemas/paySchema';
import { SorteioSchema } from '../schemas/sorteioSchema';
import enviarEmail from '../jobs/email';

class WebhookPagamento {
    async handle(req: Request, res: Response) {
        const payment = req.body; // Payment data sent by Mercado Pago
        const PayModel = mongoose.model('Pagamentos', PaySchema); // Payment model
        const SorteioModel = mongoose.model('Sorteios', SorteioSchema); // Raffle model

        if (payment.action !== 'payment.created') {
            return res.send('Not a payment event.');
        } // Check if it's a payment creation event

        const paymentId = payment.data.id;
        const paymentStatus = payment.data.status;
        const sorteioId = payment.data.metadata.sorteioId;
        const userData = payment.data.metadata.user;

        const payDoc = await PayModel.findById(paymentId);
        
        if (!payDoc) {
            return res.status(404).send('Payment not found.');
        } // Check if the payment exists in the database

        payDoc.status = paymentStatus;
        await payDoc.save();

        if (paymentStatus === 'approved') {
            const sorteio = await SorteioModel.findById(sorteioId);
            sorteio.ticketsSold += 1;
            await sorteio.save();
        } // Update the raffle if the payment is approved

        enviarEmail(userData.email, 'Payment Confirmation', 'Your payment was successful.');

        return res.send('Payment processed.');
    }
}

export default WebhookPagamento;

```

<p>This is the function that receives the transaction ID. Every time the transaction status changes, I fetch details using a function that takes the payment ID as a parameter. This allows me to retrieve the details passed in the payment link and other information, such as the new status, which needs to be updated in the database.</p>
</div>

<div>
    <h4>And this is the flow...</h4>
    <p>Some observations:</p>
    <ul>
        <li>You cannot use localhost as the callback URL in the Mercado Pago panel. For this, you can use ngrok to create a public URL for your backend.</li>
        <li>Payments with split typically take about 2 days to be deposited into the account.</li>
    </ul>
</div>
