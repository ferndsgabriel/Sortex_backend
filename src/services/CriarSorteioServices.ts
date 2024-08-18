import mongoose, { mongo } from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { cardSchema } from "../schemas/cartaoSchema";
import { produtoSchema } from "../schemas/produtoSchema";
import { sorteioSchema } from "../schemas/sorteioShema";

interface sorteioProps {
    id:String;
    productId:String,
    dataInicio:Date,
    dataTermino:Date,
    price:Number,
    title:String,
}


class CriarSorteioServices{
    async execute({id, productId, dataInicio, dataTermino, price, title}:sorteioProps){

        if (!id || !productId || !dataInicio || !dataTermino || !price || !title){
            throw new Error ('Digite todos os campos');
        } // verifico se todos os campos necessarios estão sendo enviados

        const admModel = mongoose.model('Administrador', admSchema); // obtendo adm model

        const procurarAdm = await admModel.findById(id) // obtendoa adm pelo id

        if (!procurarAdm){
            throw new Error ('Administrador não econtrado');
        } // se n tiver o adm...

        const cardModel = mongoose.model('Cartaos', cardSchema); // card model;

        const pegandoCartao = await cardModel.findOne({admRef:id}); // pegando o card do adm

        if (!pegandoCartao){
            throw new Error ('Cartão não encontrado');
        } // se n encontrar o cartão
        
        const produtoModel = mongoose.model('Produtos', produtoSchema); // model do produto

        const pegandoProduto = await produtoModel.findById(productId); // procurando o produto pelo seu id

        if (!pegandoProduto){
            throw new Error ('Produto não encontrado');
        } // se n achar o produto...
        
        const onDay = new Date(); // pegando a data atual

        if (dataInicio < onDay){
            throw new Error ('Digite uma data válida');
        } // verifico se o dia de inicio n é menor que o dia atual

        const tempoMaxStart = new Date(); // crio um variavel para setar o tempo maximo que um sorteio pode começar

        tempoMaxStart.setMonth(onDay.getMonth() + 1);  // falo que o periodo limite é de 1 mes

        if (dataInicio > tempoMaxStart){
            throw new Error('O início do período deve ser no máximo até um mês a partir de hoje.');
        } // verifico se está respeitando esse limite

        if (dataInicio > dataTermino){
            throw new Error ('Digite uma data válida');
        } // n deixo a data de termino ser menor que o periodo de inicio

        const sorteioModel = mongoose.model('Sorteio', sorteioSchema); // obtendo o model do sorteio

        const newSorteio = new sorteioModel({
            admRef:id,
            produtoRef:pegandoProduto._id,
            cartaoRef:pegandoCartao._id,
            dataInicio,
            dataTermino,
            price,
            title,
        });

        await newSorteio.save();

        return (newSorteio);
    }   
}

export{CriarSorteioServices}