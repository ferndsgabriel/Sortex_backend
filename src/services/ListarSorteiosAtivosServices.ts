import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { sorteioSchema } from "../schemas/sorteioShema";

interface sorteioProps { 
    id:string;
    per_page:string;
    page:string;
}

class ListarSorteiosAtivosServices{
    async execute({id, per_page, page}:sorteioProps){
        if (!id){
            throw new Error ('Id do administrador não encontrado');
        }

        const admModel = mongoose.model('Administradores', admSchema);

        const procurarAdm = await admModel.findById(id);

        if (!procurarAdm){
            throw new Error ("Administrador não encontrado");
        }
        
        const sorteioModal = mongoose.model('Sorteios', sorteioSchema);

        const procurarSorteios = await sorteioModal.find({admRef:id, drawn:true}).catch((error)=>{
            console.log(error);
            throw new Error ('Erro ao encontrar sorteios');
        });


        const per_page_number = parseInt(per_page);
        const pages_number = parseInt(page)
        const pagesMax = Math.ceil(procurarSorteios.length/per_page_number); 

        const sendPage = Math.max(1, Math.min(pages_number, pagesMax));


        const sliceStart = (sendPage - 1) * per_page_number;
        const sliceEnd = (sendPage * per_page_number)
        const sliceSorteio = procurarSorteios.slice(sliceStart, sliceEnd)        

        return {
            itens:sliceSorteio,
            maxPages:pagesMax
        };
    }
}

export {ListarSorteiosAtivosServices}