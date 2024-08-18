import { MercadoPagoConfig, Payment } from 'mercadopago';

class processPayment  {
	async handle(){
	
		const acessToken = 'APP_USR-3875468438633898-081813-9d31fe90f35d2d54d472518259ab45d8-247395576';

		const client = new MercadoPagoConfig({ accessToken: acessToken, options: { timeout: 5000} });

		const payment = new Payment(client);

		const body = {
			transaction_amount: 0.01,
			description: 'teste',
			payment_method_id: 'pix',
			payer: {
				email: 'gabrielsilvafernandes5760@gmail.com'
			},
		};

		payment.create({ body}).then(console.log).catch(console.log);
	}
}

export {processPayment}
