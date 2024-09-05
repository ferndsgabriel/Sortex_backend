import mongoose, { Types } from "mongoose";
import { admSchema } from "../schemas/admSchema";
import { socialSchema } from "../schemas/socialSchema";

interface SocialProps {
    adm: Types.ObjectId | string;
    instagram?: string;
    twitch?: string;
    youtube?: string;
    tiktok?: string;
}

class CriarSocialMediaServices {
    async execute({ adm, youtube, twitch, tiktok, instagram }: SocialProps) {
        
        if (!adm) {
        throw new Error("Preencha todos os campos");
        }

        const admModel = mongoose.model("Administradores", admSchema);

        const procuraAdm = await admModel.findById(adm);

        if (!procuraAdm) {
        throw new Error("Administrador não encontrado");
        }

        const socialModel = mongoose.model("Sociais", socialSchema);

        const socialCadastrada = await socialModel.findOne({ admRef: adm });

        const baseLink = 'https://www.'

        if (socialCadastrada) {
            await socialModel.updateOne({ admRef: adm }, { $set:{instagram:`${baseLink}${instagram}`, 
            twitch:`${baseLink}${twitch}`, 
            youtube:`${baseLink}${youtube}`, 
            tiktok:`${baseLink}${tiktok}`} });
        } 
        else {
            await socialModel.create({ admRef: adm }, { $set:{instagram:instagram, twitch:twitch, youtube:youtube, tiktok:tiktok} });
        }
        return {ok:true};
    }
}
export {CriarSocialMediaServices}