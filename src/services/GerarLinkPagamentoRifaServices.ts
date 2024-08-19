import mongoose, { Types } from "mongoose"
import gerarLinkPagamento from "../mercadopago/gerarLinkPagamento";
import { sorteioSchema } from "../schemas/sorteioShema";
import { cardSchema } from "../schemas/cartaoSchema";

interface pagamentoProps{
    sorteioId: string;
    metodoDePagamento: string;
    email: string;
    name: string;
    whatsapp: string;
}

interface sorteioProps {
    title: string;
    admRef: string;
    price: number;
    status:boolean
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

        if (procurarSorteio.status === false){
            throw new Error ("Este sorteio já se encerrou")
        }

        const cardModel = mongoose.model('Cartaos', cardSchema); //crio um model de cards

        const procurarCard = await cardModel.findOne({ admRef: procurarSorteio.admRef }); // procuro o cartão

        if (!procurarCard) {
            throw new Error('Cartão não encontrado'); // se não achar
        }

        const descricao = `Pagamento da rifa: ${procurarSorteio.title}`; // obtenho a descrição do sorteio
        const preco = procurarSorteio.price; // o preço da rifa

        const accessToken: string | any = procurarCard.accessToken // access token para direcionar o pagamento

        // Chama a função processPayment com os parâmetros corretos

        const user = {
            name:name,
            email:email,
            whatsapp:whatsapp
        }
        const response = await  gerarLinkPagamento({accessToken:'APP_USR-3875468438633898-081711-c309e7f4bcf3481cac8562b69a9869b4-247395576',
            amount: preco,
            description: descricao,
            user:user,
            method: metodoDePagamento,
            sorteioId:sorteioId
        });

        const id = response.id;
        const status = response.status;

        const newPush = {
            id:id,
            status:status,
            user:{
                email:email,
                whatsapp:whatsapp,
                name:name  
            }
        }
        
        await sorteioModel.findByIdAndUpdate(
            sorteioId, 
            { $push: { rifas:newPush } }, 
            { new: true } 
        ).catch((error)=>{
            return (error);
        })

        return response;
    }

}

export { GerarLinkPagamentoRifaServices }
