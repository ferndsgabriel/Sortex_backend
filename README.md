### Sortex - Backend 


<div>
    <h2>About 🚨</h2>
    <p>
        Sortex is a project designed for managing raffles and giveaways. Users can register and log in, link their Mercado Pago accounts, create raffles, and generate links for the raffles. When purchasing tickets, users need to provide identification information for potential winners, select the desired quantity, and complete the payment.
    </p>
</div>
<div>
    <div>
        <h2>Tools 🛠</h2>  
        <img src='https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white' alt='Node'/>     
        <img src='https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white' alt='TS'
        />
        <img src='https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white' alt='MongoDB'/>
    </div>
    <br/>
</div>


```bash
    # Clone the project
    $ git clone https://github.com/ferndsgabriel/Sortex_backend.git
```   
```bash
    # install dependencies
    $ yarn install
```   
```bash
    # install dependencies, if use npm
    $ npm install
``` 
```bash
    # start project
    $ yarn dev
```   
```bash
    # start project
    $ npm run dev
``` 
<div>
    <h2> Fluxo de pagamento e obter token acess para o vendedor receber cobranças </h2>
    <p><b>Primeiro:</b> Gerar o link para obter o auth token do vendedor<br/></p>
    <p>Você pode gerar esse link em uma função simples e retornar em um endpoint </p>

``` javascript
    const baseUrl = 'https://auth.mercadopago.com.br/authorization?'; 
    const clientId = `client_id=${process.env.MERCADO_PAGO_CLIENT_ID}`;
    const responseType = '&response_type=code&platform_id=mp&';
    const redirect = `redirect_uri=${process.env.BASE_URL}/sallercallback`;
    const idReq = `&state=${id}`;

    const result = `${baseUrl}${clientId}${responseType}${redirect}${idReq}`;
```
<p> O link precisa do client id da sua aplicação, um redirect e pode se passar outros dados. Eu passei o id dono do sorteio.<p><br/>
</div>

<div>
    <p><b>Segundo:</b> Criar uma função que o endpoint vai ser o redirect do link gerado no passo 1.<p>

``` javascript
import { Request, Response } from 'express';
import { cardSchema } from '../schemas/cartaoSchema';
import mongoose from 'mongoose';

class GetSaller {
    async handle(req: Request, res: Response) {

        // essa função está vinculado a rota sallercallback, que é o redirect do adm após logar em sua conta do mp para poder receber os pagamentos
        const authCode = req.query.code as string; // recebo o token da requisição 
        const stateId = req.query.state as string; // recebo o id do user 


        if (!authCode) {
            res.status(400).json('Código de autorização não encontrado.');
        } // se n tiver o token.... 

        if (!stateId){
            res.status(400).json('Id não encontrado');
        } // se eu n receber o id...

        const cardModel = mongoose.model('Cartaos', cardSchema); // crio um model de card

        const obterModels = await cardModel.find({admRef:stateId}); // verifico se meu adm possui uma cartão

        if (obterModels.length > 0){
            res.status(400).json('Você já possui uma conta vinculada');
        } // se ele tiver...
        
        const newCard = new cardModel({
            authCode:authCode,
            admRef:stateId
        }); // crio um novo card no db e salvo o authCode

        await newCard.save();
        //obs: passei a armazenar o auth token e gerar o acess token só na hora de gerar o link de compra, vi que é mais seguro
        // além de que o acess token pode expirar
        return res.json({
            body:req.body,
            query:req.query
        })
        //return res.status(201).json('Conta vinculada com sucesso.');
    }
}

export { GetSaller };
```
<p> Como eu enviei o id do administrador (vamos chamar assim, o responsavel pelo sorteio). No link, posso pega-lo nessa função de callback, junto com o auth token e salvar no banco de dados.<p><br/>
</div>

<p>
    Esse mesmo endpoint que foi passado no link e recebe a função de callback, precisa ser configurado no Mercado Pago
</p>

``` javascript
    routes.get('/sallercallback', new GetSaller().handle);
```
</div>

<div>
    <p>Você pode obter o acess token através de um fetch agora que já possuí o acess token</p>

``` javascript
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
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};


export default axiosSaller
```
<p><b>Obs:</b> Eu deixo para obter o acessToken apenas quando vou gerar a compra</b></p>
</div>