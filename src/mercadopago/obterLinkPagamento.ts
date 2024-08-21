import { MercadoPagoConfig, Payment } from 'mercadopago';
import { formatEmail } from '../utils/formats';
import axios from 'axios';

interface paymentProps{
	accessToken:string;
	amount:number;
	description:string;
	user:{
		name:string;
		email:string;
		whatsapp:string
	};
	sorteioId:string
	qtd:number
}
	
async function ObterLinkPagamento({accessToken, amount, description, user,  sorteioId, qtd}:paymentProps){

	const aplicacaoAcessToken = process.env.MERCADO_PAG0_ACCESS_TOKEN as string; // vou usar para poder dividir o pagamento

	const client = new MercadoPagoConfig({ accessToken:accessToken, options: { timeout: 5000} }); 

	const payment = new Payment(client);

	const total = (amount * qtd); // o valor vai ser o preço X a qtd de rifas compradas
	
	const body = {
		transaction_amount: total,
		description: description,
		payment_method_id: 'pix',
		token:accessToken,
		payer: {
			email: formatEmail(user.email),
			first_name: user.name.split(' ')[0], // Assume o primeiro nome
			last_name: user.name.split(' ')[1] 
		},
		metadata: {
			sorteioId: sorteioId,
			user:user
		},
		
	}; // corpo da função

	
    try {
        const sucess = await payment.create({ body });
        const transactionData = sucess.point_of_interaction.transaction_data;

        return {
			id:sucess.id,
            url: transactionData.ticket_url,
            status: sucess.status,  
            statusDetail: sucess.status_detail 
        };
    } catch (error) {
		console.log(error)
        throw (error.code);
    }
}

export default ObterLinkPagamento;