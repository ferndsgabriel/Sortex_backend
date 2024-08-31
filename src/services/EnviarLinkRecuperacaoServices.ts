import mongoose from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { randomUUID} from "crypto";
import { recoverySchema } from "../schemas/recoverySchema";
import { SendEmail } from "../nodemailer";
import "dotenv/config";

class EnviarLinkRecuperacaoServices{
    async execute(email:string){

        if (!email){
            throw new Error ("Digite seu e-mail");
        }
        
        const formatEmail = email.toLowerCase().trim();

        const admModel = mongoose.model('Administradores', admSchema);

        const procurarAdm = await admModel.findOne({email:formatEmail});

        if (!procurarAdm){
            throw new Error ("E-mail não encontrado");
        }

        const uid = randomUUID();
        const cod = uid.split('-')[0];

        const period = new Date();

        const recoveryModel = mongoose.model('Codigos', recoverySchema);

        const procurarRecovery = await recoveryModel.findOne({admRef:procurarAdm._id});

        if (!procurarRecovery){
            const createCod = new recoveryModel({
                cod:cod,
                admRef:procurarAdm._id,
                period:period
            });

            await createCod.save();
        }else{
            await recoveryModel.updateOne({admRef:procurarAdm._id}, {$set:{cod:cod, period:period}});
        }


        const link = encodeURI(`${process.env.FRONT_URL}/recovery/${cod}/${procurarAdm._id}`);


        const message = `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Olá, ${procurarAdm.name}</p><br>
            <p>🔐 Recebemos uma solicitação de recuperação de conta para o Sortex.</p>
    
            <p><strong>${link}</strong></p><br>

            <p>Este link é válido por um curto período de tempo. Não compartilhe com ninguém.</p><br>
            <p>Se você não solicitou essa recuperação ou tiver qualquer dúvida, entre em contato conosco.</p><br>

            <p>Atenciosamente,<br>
            Equipe de Suporte do Sortex 🌟</p>
        </div>
        `;
        try{
            await SendEmail(formatEmail, message);
            return {ok:true};
        }catch(error){
            console.log(error);
        }
        
    }
}

export {EnviarLinkRecuperacaoServices}