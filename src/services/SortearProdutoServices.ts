import mongoose, { Types } from "mongoose";
import { sorteioSchema } from "../schemas/sorteioShema";


interface User {
    name: string;
    email: string;
    whatsapp: string;
}

interface SorteiosProps {
    rifas: {
        user: User;
    }[];
    status: boolean;
}


class SortearProdutoServices{
    async execute(sorteioId:Types.ObjectId){

        if (!sorteioId){
            throw new Error ('Envie o id do sorteio');
        }

        const sorteioModel = mongoose.model<SorteiosProps>('Sorteios', sorteioSchema);

        const obterSorteio = await sorteioModel.findById(sorteioId);

        if (!obterSorteio){
            throw new Error ('Sorteio não econtrado');
        }

        if (obterSorteio.status === true){
            throw new Error ('O sorteio precisa ser encerrado');
        }

        function shuffleArray<T>(array: T[]): T[] {
            const newArray = [...array]; // Cria uma cópia do array
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        } // função que embaralha um array
        
        const embaralharRifas = shuffleArray(obterSorteio.rifas); // obtenho um array embaralhado

        function sortear(listLength: number): number {
            return Math.floor(Math.random() * listLength);
        }
        const randomIndex = sortear(embaralharRifas.length);

        await sorteioModel.updateOne({ _id: sorteioId }, { $set: { rifas: embaralharRifas, winner:randomIndex, status:false} }).then(()=>{
        }).catch((error)=>{
            return ('Erro ao gerar sorteio');
        }); // dou um update no db 

        return { 
            winner:{
                name:embaralharRifas[randomIndex].user.name,
                email:embaralharRifas[randomIndex].user.email,
                whatsapp:embaralharRifas[randomIndex].user.whatsapp,
            },
            position:randomIndex
        }
    }
}

export {SortearProdutoServices}