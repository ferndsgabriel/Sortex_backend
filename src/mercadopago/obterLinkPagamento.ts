import { MercadoPagoConfig, Payment } from 'mercadopago';
import { formatEmail } from '../utils/formats';

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

	const total = amount * qtd;

	const porcentagem = 3; 
	
	const valuePlataform = parseFloat((total * (porcentagem / 100)).toFixed(2));

	const application = valuePlataform >= 0.01 ? valuePlataform : null;

	const client = new MercadoPagoConfig({ accessToken:accessToken}); 

	const payment = new Payment(client);
	const body : any = {
		application_fee:application,
		transaction_amount: total,
		description: description,
		payment_method_id: 'pix',
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