import mongoose, { Types } from "mongoose"
import gerarLinkPagamento from "../mercadopago/gerarLinkPagamento";
import { sorteioSchema } from "../schemas/sorteioShema";
import { cardSchema } from "../schemas/cartaoSchema";
import axiosSaller from "../mercadopago/axiosSaller";

interface pagamentoProps{
    sorteioId: string;
    metodoDePagamento: string;
    email: string;
    name: string;
    whatsapp: string;
    qtd:number
}

interface sorteioProps {
    title: string;
    admRef: string;
    price: number;
    status:boolean,
}


class GerarLinkPagamentoRifaServices {

    async execute({ sorteioId, metodoDePagamento, email, name, whatsapp, qtd }: pagamentoProps) {

        if (!sorteioId || !metodoDePagamento || !email || !name || !whatsapp || qtd <= 0) {
            throw new Error('Preencha todos os campos'); // garantir que o user vai enviar todos os dados
        }

        const sorteioModel = mongoose.model('Sorteios', sorteioSchema); //crio um model de sorteio

        const procurarSorteio: sorteioProps = await sorteioModel.findById(sorteioId); // procuro o sorteio 

        if (!procurarSorteio) {
            throw new Error('Sorteio não encontrado.'); // se não achar o sorteio
        }

        if (procurarSorteio.status === false){
            throw new Error ("Este sorteio já se encerrou")
        } // se o status estiver como false, significa que o sorteio já encerrou

        const cardModel = mongoose.model('Cartaos', cardSchema); //crio um model de cards

        const procurarCard = await cardModel.findOne({ admRef: procurarSorteio.admRef }); // procuro o cartão

        if (!procurarCard) {
            throw new Error('Cartão não encontrado'); // se não achar
        } 

        if (qtd < 1 ){
            throw new Error ("Digite uma quantidade maior que zero")
        } // a qtd de rifas precisa ser maior que 0

        const descricao = `Pagamento da rifa: ${procurarSorteio.title}`; // obtenho a descrição do sorteio
        const preco = procurarSorteio.price; // o preço da rifa

        const authCode = procurarCard.authCode.toString(); // access token para direcionar o pagamento

        const accessToken =  await axiosSaller(authCode).then(); 
        //chamo o axios para gerar o acess token atraves do auth token
        // esse acesssToken é o responsavel por poder enviar pagamentos a conta do adm
        
        if (!accessToken){
            throw new Error('Erro ao vincular conta de cobranças');
        } // se eu n tenho um token...

        const user = {
            name:name,
            email:email,
            whatsapp:whatsapp
        }
        const response = await  gerarLinkPagamento({accessToken,
            amount: preco,
            description: descricao,
            user:user,
            method: metodoDePagamento,
            sorteioId:sorteioId,
            qtd:qtd
        }); // gero link de pagamento enviando os dados necessarios

        const id = response.id; // obtenho o id da transação 
        const status = response.status; // status da transação

        if (!id || !status){
            throw new Error ("Erro ao gerar link de pagamento");
        } // se n tiver id ou status, retorno um erro

        const newPush = {
            id:id,
            status:status,
            user:{
                email:email,
                whatsapp:whatsapp,
                name:name  
            }
        } // formato como os arquivos vão ser enviados;
        
        for (let x = 0; x < qtd; x++){
            await sorteioModel.findByIdAndUpdate(
                sorteioId, 
                { $push: { rifas:newPush } }, 
                { new: true } 
            ).catch((error)=>{
                return (error);
            })
        }; // faço um loop para gerar no db a qtd de rifas que ele comprou 


        return response; // retorno o link
    }

}

export { GerarLinkPagamentoRifaServices }
