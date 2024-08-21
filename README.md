```
# Sortex - Backend

## About 🚨
Sortex is a project designed for managing raffles and giveaways. Users can register and log in, link their Mercado Pago accounts, create raffles, and generate links for the raffles. When purchasing tickets, users need to provide identification information for potential winners, select the desired quantity, and complete the payment.

## Tools 🛠  
<img src='https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white' alt='Node'/>
<img src='https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white' alt='TS'/>
<img src='https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white' alt='MongoDB'/>    
<<<<<<< HEAD

## Setup

```bash
# Clone the project
$ git clone https://github.com/ferndsgabriel/Sortex_backend.git

# Install dependencies
$ yarn install

# If using npm, install dependencies
$ npm install

# Start project
$ yarn dev

# If using npm, start project
$ npm run dev
```

=======

## Setup

```bash
# Clone the project
$ git clone https://github.com/ferndsgabriel/Sortex_backend.git

# Install dependencies
$ yarn install

# If using npm, install dependencies
$ npm install

# Start project
$ yarn dev

# If using npm, start project
$ npm run dev
```

## Payment Flow and Obtain Access Token for Seller Payments

### Step 1: Generate the Link to Obtain the Seller's Auth Token

You can generate this link in a simple function and return it in an endpoint.

```javascript
const baseUrl = 'https://auth.mercadopago.com.br/authorization?'; 
const clientId = `client_id=${process.env.MERCADO_PAGO_CLIENT_ID}`;
const responseType = '&response_type=code&platform_id=mp&';
const redirect = `redirect_uri=${process.env.BASE_URL}/sallercallback`;
const idReq = `&state=${id}`;

const result = `${baseUrl}${clientId}${responseType}${redirect}${idReq}`;
```
This link requires the client ID of your application, a redirect URI, and can include other data. I passed the raffle owner's ID.

### Step 2: Create a Callback Function for the Generated Link

```javascript
import { Request, Response } from 'express';
import { cardSchema } from '../schemas/cartaoSchema';
import mongoose from 'mongoose';

class GetSaller {
    async handle(req: Request, res: Response) {
        const authCode = req.query.code as string;
        const stateId = req.query.state as string;

        if (!authCode) {
            res.status(400).json('Authorization code not found.');
        }

        if (!stateId){
            res.status(400).json('ID not found.');
        }

        const cardModel = mongoose.model('Cartaos', cardSchema);
        const obterModels = await cardModel.find({admRef: stateId});

        if (obterModels.length > 0){
            res.status(400).json('Account already linked.');
        }
        
        const newCard = new cardModel({
            authCode: authCode,
            admRef: stateId
        });

        await newCard.save();

        return res.json({
            body: req.body,
            query: req.query
        });
    }
}

export { GetSaller };
```

The same endpoint passed in the link and receiving the callback function needs to be configured in Mercado Pago.

```javascript
routes.get('/sallercallback', new GetSaller().handle);
```

### Step 3: Obtain the Access Token

Now that you have the auth token, you can fetch the access token.

```javascript
import axios from 'axios';
import "dotenv/config";

const clientId = process.env.MERCADO_PAGO_CLIENT_ID as string;
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
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default axiosSaller;
```
**Note:** It's safer to obtain the access token only when generating the purchase link since it can expire.

### Step 4: Generate the Payment Link

Create an endpoint that returns the payment link. First, create a function to handle the payment.

```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { formatEmail } from '../utils/formats';

interface paymentProps {
    accessToken: string;
    method: string;
    amount: number;
    description: string;
    user: {
        name: string;
        email: string;
        whatsapp: string;
    };
    sorteioId: string;
    qtd: number;
}

async function gerarLinkPagamento({ accessToken, amount, description, user, method, sorteioId, qtd }: paymentProps) {
    const client = new MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 5000 } });
    const payment = new Payment(client);

    const total = (amount * qtd);

    const body = {
        transaction_amount: total,
        description: description,
        payment_method_id: method,
        payer: {
            email: formatEmail(user.email),
        },
        metadata: {
            sorteioId: sorteioId,
            user: user
        },
    };

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
        throw new Error('Error generating payment link');
    }
}

export default gerarLinkPagamento;
```
<h3> The accessToken should be the one generated through the axiosSaller function with the auth token collected from the user. </h1>
<p><b>Note:</b> I send in the body of the function <b>amount:</b> the charge amount, <b>description:</b> the description that will appear at the time of payment, <b>payment_method_id:</b> the payment method type (visa, master, pix...), <b>Payer:{email}:</b> Email of the payer. All these data are mandatory. However, I send other information in metaData, such as raffle ID and information collected from the payer.</p>
</div>

<div>
    <p><b>Fourth:</b> Now that we have the admin's auth token, we use the axiosSaller function to obtain the accessToken for the user at the time of generating the payment link, and we generate the payment link in the return of the function: generatePaymentLink. We need to monitor the transaction status. You can save the payment only when the webhook we will use to check the status of transactions shows it as approved, but this might cause issues if the webhook does not respond or if our server has issues during communication, which is why I store the payment when I generate the link.<p>
    
```javascript
import mongoose, { Types } from "mongoose"
import generatePaymentLink from "../mercadopago/generatePaymentLink";
import { raffleSchema } from "../schemas/raffleSchema";
import { cardSchema } from "../schemas/cardSchema";
import axiosSaller from "../mercadopago/axiosSaller";

interface PaymentProps {
    raffleId: string;
    paymentMethod: string;
    email: string;
    name: string;
    whatsapp: string;
    quantity: number;
}

interface RaffleProps {
    title: string;
    adminRef: string;
    price: number;
    status: boolean,
    drawn: boolean;
}

class GeneratePaymentLinkRaffleServices {

    async execute({ raffleId, paymentMethod, email, name, whatsapp, quantity }: PaymentProps) {

        if (!raffleId || !paymentMethod || !email || !name || !whatsapp || quantity <= 0) {
            throw new Error('Please fill all fields'); // ensure all data is provided
        }

        const raffleModel = mongoose.model('Raffles', raffleSchema); // create a raffle model

        const foundRaffle: RaffleProps = await raffleModel.findById(raffleId); // find the raffle 

        if (!foundRaffle) {
            throw new Error('Raffle not found.'); // if raffle is not found
        }

        if (foundRaffle.status === false) {
            throw new Error("Raffle sale ended");
        } // if status is false, it means the raffle sales are closed
        
        if (foundRaffle.drawn === false) {
            throw new Error("Raffle ended");
        } // if drawn is false, it means the raffle has ended

        const cardModel = mongoose.model('Cards', cardSchema); // create a card model

        const foundCard = await cardModel.findOne({ adminRef: foundRaffle.adminRef }); // find the card

        if (!foundCard) {
            throw new Error('Card not found'); // if card is not found
        } 

        if (quantity < 1) {
            throw new Error("Enter a quantity greater than zero");
        } // quantity must be greater than 0

        const description = `Payment for raffle: ${foundRaffle.title}`; // get raffle description
        const price = foundRaffle.price; // raffle price

        const authCode = foundCard.authCode.toString(); // access token to direct the payment

        const accessToken = await axiosSaller(authCode).then(); 
        // call axios to generate the access token using the auth token
        // this accessToken is responsible for sending payments to the admin's account
        
        if (!accessToken) {
            throw new Error('Error linking payment account');
        } // if no token...

        const user = {
            name: name,
            email: email,
            whatsapp: whatsapp
        }
        const response = await generatePaymentLink({
            accessToken,
            amount: price,
            description: description,
            user: user,
            method: paymentMethod,
            raffleId: raffleId,
            quantity: quantity
        }); // generate payment link sending necessary data

        const id = response.id; // get transaction id
        const status = response.status; // transaction status

        if (!id || !status) {
            throw new Error("Error generating payment link");
        } // if no id or status, return an error

        const newPush = {
            id: id,
            status: status,
            user: {
                email: email,
                whatsapp: whatsapp,
                name: name  
            }
        } // format how the files will be sent;
        
        for (let x = 0; x < quantity; x++) {
            await raffleModel.findByIdAndUpdate(
                raffleId, 
                { $push: { raffles: newPush } }, 
                { new: true } 
            ).catch((error) => {
                return (error);
            })
        }; // loop to generate in db the number of raffles purchased 

        return response; // return the link
    }
}

export { GeneratePaymentLinkRaffleServices }
```

<p>As we can see: I save in my database the transaction id, status, and user information as soon as I generate the payment link.</p>
</div>

<div>
    <p><b>Fifth:</b> Go to the Mercado Libre API, in webhooks, and add an endpoint that we will configure in our API to be called whenever there is a change in payment status: 
    <a href='https://www.mercadopago.com.br/developers/panel/app/3875468438633898/webhooks' target="_blank">Link</a><p>
    
```javascript
import { Request, Response } from 'express';
import axiosPayment from './axiosPayment';
import mongoose, { Schema, Document } from 'mongoose';
import { raffleSchema } from '../schemas/raffleSchema';

interface RaffleProps {
    id: number; // or string, depending on the real type
    status: string;
    user: {
        name: string;
        email: string;
        whatsapp: string;
    };
}

interface RaffleModel extends Document {
    raffles: RaffleProps[];
    status: boolean;
}

class CheckPayment {
    async handle(req: Request, res: Response) {

        // this is the route where the MP webhook will return payment status changes

        const { data } = req.body; // get everything in the data received from this webhook

        const id = data.id.toString(); // get id from data obj 
    
        try {
            const response = await axiosPayment(id); // execute an MP endpoint that returns all payment information through the id
            
            const { status, metadata: { raffle_id: raffleId, user } } = response.data;
            // get information from this endpoint that I will need

            const raffleModel = mongoose.model<RaffleModel>('Raffles', raffleSchema); // create a raffle model
            
            // Find the raffle
            const foundRaffle = await raffleModel.findById(raffleId).exec(); // check if the raffle id from the endpoint exists in the db
    
            if (!foundRaffle) {
                return res.status(400).json('Raffle not found');
            } // if not found...
    
            // Check if raffles exists and is an array
            if (!Array.isArray(foundRaffle.raffles)) {  
                return res.status(400).json('Raffles is not an array');
            } 
            // Check if raffles exists and is an array

            let updatedRaffles: RaffleProps[] = []; // create a list 
    
            foundRaffle.raffles.forEach((item) => {
                if (item.id.toString() === id.toString()) {
                    const updateUser: RaffleProps = {
                        id: item.id,
                        user: user,
                        status: status
                    }
                    updatedRaffles.push(updateUser);
                } else {
                    updatedRaffles.push(item);
                }
            }); // push into updatedRaffles while checking all that contain the payment id
            // that was altered, note: more than one raffle might be affected if the user purchased 4 raffles and the payment was
            // in the same transaction, all will have the same payment id
    
            await raffleModel.updateOne({ _id: raffleId }, { raffles: updatedRaffles }).exec(); // update all raffles in db
    
            return res.status(200).json('Ok');
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default new CheckPayment();
```

<p>Now that we have the API files, if you want to ensure it will work, perform a test. If you need help testing, just let me know.</p>
</div>

