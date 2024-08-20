import { MercadoPagoConfig, Payment } from 'mercadopago';
import { formatEmail } from '../utils/formats';

interface paymentProps{
	accessToken:string;
	method:string;
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

async function gerarLinkPagamento({accessToken, amount, description, user, method, sorteioId, qtd}:paymentProps){

	const client = new MercadoPagoConfig({ accessToken:accessToken, options: { timeout: 5000} }); 

	const payment = new Payment(client);

	const total = (amount * qtd); // o valor vai ser o preço X a qtd de rifas compradas
	
	const body = {
		transaction_amount: total,
		description: description,
		payment_method_id: method,
		payer: {
			email: formatEmail(user.email),
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
        console.log(error);
        throw new Error('Erro ao gerar link de pagamento');
    }
}

export default gerarLinkPagamento;
