import mongoose, { Types } from "mongoose"
import processPayment from "../mercadopago/processPayment"
import { sorteioSchema } from "../schemas/sorteioShema";
import { cardSchema } from "../schemas/cartaoSchema";

interface pagamentoProps{
    sorteioId: Types.ObjectId;
    metodoDePagamento: string;
    email: string;
    name: string;
    whatsapp: string;
}

interface sorteioProps {
    title: string;
    admRef: string;
    price: number;
}

class GerarLinkPagamentoRifaServices {

    async execute({ sorteioId, metodoDePagamento, email, name, whatsapp }: pagamentoProps) {

        if (!sorteioId || !metodoDePagamento || !email || !name || !whatsapp) {
            throw new Error('Preencha todos os campos'); // garantir que o user vai enviar todos os dados
        }

        const sorteioModel = mongoose.model('Sorteios', sorteioSchema); //crio um model de sorteio

        const procurarSorteio: sorteioProps = await sorteioModel.findById(sorteioId); // procuro o sorteio 

        if (!procurarSorteio) {
            throw new Error('Sorteio não encontrado.'); // se não achar o sorteio
        }

        const cardModel = mongoose.model('Cartaos', cardSchema); //crio um model de cards

        const procurarCard = await cardModel.findOne({ admRef: procurarSorteio.admRef }); // procuro o cartão

        if (!procurarCard) {
            throw new Error('Cartão não encontrado'); // se não achar
        }

        const descricao = `Pagamento da rifa: ${procurarSorteio.title}`; // obtenho a descrição do sorteio
        const preco = procurarSorteio.price; // o preço da rifa
        const accessToken: string | any = procurarCard.acessToken // access token para direcionar o pagamento

        // Chama a função processPayment com os parâmetros corretos
        const response = await processPayment({
            accessToken: accessToken,
            amount: preco,
            description: descricao,
            email: email,
            user:{
                email:email,
                whatsapp:whatsapp,
                name:name  
            },
            method: metodoDePagamento,
            sorteioId:sorteioId.toString()
        });

        return response
    }

}

export { GerarLinkPagamentoRifaServices }
