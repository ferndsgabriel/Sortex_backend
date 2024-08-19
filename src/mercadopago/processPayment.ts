import { MercadoPagoConfig, Payment } from 'mercadopago';
import { formatEmail } from '../utils/formats';

interface paymentProps{
	accessToken:string;
	method:string;
	email:string;
	amount:number;
	description:string;
	user:{
		name:string;
		email:string;
		whatsapp:string
	};
	sorteioId:string
}

async function processPayment({accessToken, amount, description, user, method, sorteioId}:paymentProps){

	const client = new MercadoPagoConfig({ accessToken: 'APP_USR-3875468438633898-081818-a0e702f4a186aa4cb928da837ef61eda-247395576', options: { timeout: 5000} });

	const payment = new Payment(client);

	const body = {
		transaction_amount: amount,
		description: description,
		payment_method_id: method,
		payer: {
			email: formatEmail(user.email),
			name:user.name,
			whatsapp:user.whatsapp
		},
		metadata:{
			sorteioId:sorteioId
		}
	};

	payment.create({ body}).then(console.log).catch(console.log);
}

export default processPayment;
