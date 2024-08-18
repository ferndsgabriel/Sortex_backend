import { compare } from 'bcryptjs';
import { admSchema } from '../schemas/admSchema';
import mongoose, { Types } from 'mongoose';
import { formatEmail } from '../utils/formats';
import { sign } from 'jsonwebtoken';

interface admProps {
    sub: string;
    email: string;
}

interface queryProps {
        _id: Types.ObjectId;
        name: string;
        email: string;
        photo: string;
        sub: string;
        __v: number;
}

class LogarAdmServives {
    async execute({ sub, email }: admProps) {
        
        if (!sub || !email) {
            throw new Error("Erro ao logar"); // verifico se recebo todos os dados
        }

        const admModel = mongoose.model('Administradores', admSchema); // obtenho uma referencia de admModel

        const emailFormatado = formatEmail(email); // formato o email

        const emailExiste: queryProps | null = await admModel.findOne( // verifico se este email existe no meu banco
            { email: emailFormatado }
        );

        if (!emailExiste) {
            throw new Error("Erro ao logar"); //se n existir n posso logar
        }

        const compararSenha = await compare(sub, emailExiste.sub); // comparo o sub recebido com o sub que existe na linha onde peguei meu email

        if (!compararSenha) {
            throw new Error("Erro ao logar"); // se n são iguais eu n posso logar
        }

        const ujwtSegredo = process.env.UJWT_ADM; // obtenho o segredo no env

        if (!ujwtSegredo) {
            throw new Error("Erro ao logar"); // se n tenho o segredo n posso logar
        }

        const token = sign(  // gero um token passando os dados 
            {
                email: emailFormatado,
            },
            ujwtSegredo,
            {
                subject: emailExiste._id.toString(),
                expiresIn: "30d",
            }
        );

        return {token: token}; // retorno esse token 
    }
}

export { LogarAdmServives };
