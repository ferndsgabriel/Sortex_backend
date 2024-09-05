import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { sorteioSchema } from "../schemas/sorteioShema";
import { produtoSchema } from "../schemas/produtoSchema";
import { socialSchema } from "../schemas/socialSchema";


interface sorteioProps { 
    admRef:string;
    produtoRef:string;
    dataTermino:Date
    title:string;
    description:string;
    price:number
    status:boolean;
    drawn:boolean
    createDate:Date
}

interface admProps{
    name:string;
    email:string;
    photo:string;
}

interface produtoProps{
    name:string;
    description:string;
    photos:[];
}

interface sociaisProps{
    instagram?:string;
    twitch?:string;
    youtube?:string;
    tiktok?:string;
}

class RifaDetalhesServices{
    async execute(id:string){

        if (!id){
            throw new Error ("Id do sorteio não enviado");
        }

        const sorteioModel = mongoose.model('Sorteios', sorteioSchema);

        const procurarSorteio:sorteioProps = await sorteioModel.findById(id);

        if (!procurarSorteio){
            throw new Error ("Sorteio não encontrado");
        }

        const onDay = new Date();

        if (onDay >= procurarSorteio.dataTermino){
            await sorteioModel.findByIdAndUpdate(id, {$set:{status:false}});
        }

        const admModel = mongoose.model('Administradores', admSchema);

        const procurarAdm:admProps = await admModel.findById(procurarSorteio.admRef);

        if (!procurarAdm){
            throw new Error ("Administrador não encontrado");
        }
        
        const produtosModel = mongoose.model('Produtos', produtoSchema); 

        const procurarProduto:produtoProps = await produtosModel.findById(procurarSorteio.produtoRef);

        if (!procurarProduto){
            throw new Error ("Produto não encontrado");
        }

        const sociaisModel = mongoose.model('Sociais', socialSchema);

        const procurarSociais:sociaisProps = await sociaisModel.findOne({admRef:procurarSorteio.admRef});
        

        const sorteio = {
            title:procurarSorteio.title,
            description:procurarSorteio.description,
            price:procurarSorteio.price,
            rafflesStatus:procurarSorteio.status,
            sortexStatus:procurarSorteio.drawn,
            dateStart:procurarSorteio.createDate,
            dateFinish:procurarSorteio.dataTermino,
        }

        const produto = {
            name:procurarProduto.name,
            description:procurarProduto.description,
            photos:procurarProduto.photos
        }

        const criador = {
            name:procurarAdm.name,
            photo:procurarAdm.photo,
        }

        const sociais = {
            instagram:procurarSociais.instagram,
            youtube:procurarSociais.youtube,
            twitch:procurarSociais.twitch,
            tiktok:procurarSociais.tiktok
        }

        return {
            creator:criador,
            socials:sociais,
            product:produto,
            sortex:sorteio
        };
    }
}

export {RifaDetalhesServices}