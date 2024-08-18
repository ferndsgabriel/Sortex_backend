import { MercadoPagoConfig, Payment } from 'mercadopago';
import 'dotenv/config';

interface paymentProps{
	value:number
}
class processPayment  {
	async handle({value}:paymentProps){

		const client = new MercadoPagoConfig(
			{ 
				accessToken: process.env.MERCADO_PAG0_ACESS_TOKEN, 
				options: { timeout: 5000, idempotencyKey: 'abc' }
			}
		);
	

		const payment = new Payment(client);
		
		const body = {
			transaction_amount: value,
			description: 'Teste',
			payment_method_id: 'pix',
			payer: {
				email: 'gabrielsilvafernandes5760@gmail.com'
			},
		};

		const bodyMe = {
			transaction_amount: value,
			description: 'Teste',
			payment_method_id: 'pix',
			payer: {
				email: 'gabrielsilvafernandes5760@gmail.com'
			},
		};
		
		await payment.create({ body }).then(console.log).catch(console.log);
	}
}

export {processPayment}
