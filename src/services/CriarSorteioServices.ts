import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { cardSchema } from "../schemas/cartaoSchema";
import { produtoSchema } from "../schemas/produtoSchema";
import { sorteioSchema } from "../schemas/sorteioShema";

interface sorteioProps {
    id: String;
    productId: String,
    dataInicio: Date,
    dataTermino: Date,
    price: Number,
    title: String,
}

class CriarSorteioServices {
    async execute({ id, productId, dataInicio, dataTermino, price, title }: sorteioProps) {

        if (!id || !productId || !dataInicio || !dataTermino || !price || !title) {
            throw new Error('Digite todos os campos');
        } // verifico se todos os campos necessarios estão sendo enviados

        const admModel = mongoose.model('Administradores', admSchema); // obtendo adm model

        const procurarAdm = await admModel.findById(id);// obtendo adm pelo id

        if (!procurarAdm){
            throw new Error('Administrador não encontrado');  // se n tiver o adm...
        }
        const cardModel = mongoose.model('Cartaos', cardSchema); // card model;

        const pegandoCartao = await cardModel.findOne({ admRef: id }); // pegando o card do adm

        if (!pegandoCartao) {
            throw new Error('Cartão não encontrado');
        } // se n encontrar o cartão

        const produtoModel = mongoose.model('Produtos', produtoSchema); // model do produto

        const pegandoProduto = await produtoModel.findById(productId) // procurando o produto pelo seu id

        if (!pegandoProduto){
            throw new Error('Produto não encontrado');
        }  // se n achar o produto...
        
        const onDay = new Date(); // pegando a data atual

        if (new Date(dataInicio) < onDay) {
            throw new Error('A data de início não pode ser menor que o dia atual');
        } // verifico se a data de início não é menor que o dia atual

        const tempoMaxStart = new Date(); // crio uma variavel para setar o tempo maximo que um sorteio pode começar

        tempoMaxStart.setMonth(onDay.getMonth() + 1);  // falo que o periodo limite é de 1 mes

        if (new Date(dataInicio) > tempoMaxStart) {
            throw new Error('O início do período deve ser no máximo até um mês a partir de hoje.');
        } // verifico se está respeitando esse limite

        if (new Date(dataInicio) > new Date(dataTermino)) {
            throw new Error('A data de término deve ser maior que a data de início');
        } // n deixo a data de término ser menor que o período de início

        const sorteioModel = mongoose.model('Sorteio', sorteioSchema); // obtendo o model do sorteio

        const newSorteio = new sorteioModel({
            admRef: id,
            produtoRef: pegandoProduto._id,
            cartaoRef: pegandoCartao._id,
            dataInicio,
            dataTermino,
            price,
            title,
        });

        await newSorteio.save();

        return (newSorteio);
    }
}

export { CriarSorteioServices }
