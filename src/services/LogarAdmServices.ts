import { compare } from 'bcryptjs';
import { admSchema } from '../schemas/admSchema';
import mongoose, { Types } from 'mongoose';
import { formatEmail } from '../utils/formats';
import { sign } from 'jsonwebtoken';

interface admProps {
    sub: string | undefined;
    email: string;
    pass:string | undefined;
}

interface queryProps {
        _id: Types.ObjectId;
        name: string;
        email: string;
        photo: string;
        sub: string;
        password: string;
        sessionToken:string;
}

class LogarAdmServives {
    async execute({ sub, email, pass }: admProps) {
        
        if (!email) {
            throw new Error("Preencha todos os campos"); // verifico se recebo todos os dados
        }

        if (!sub && !pass ){
            throw new Error("Preencha todos os campos");  // se n recebo nem o sub do google e nem o pass...
        }

        const admModel = mongoose.model('Administradores', admSchema); // obtenho uma referencia de admModel

        const emailFormatado = formatEmail(email); // formato o email

        const emailExiste: queryProps | null = await admModel.findOne( // verifico se este email existe no meu banco
            { email: emailFormatado }
        );

        if (!emailExiste) {
            throw new Error("Dados inválidos"); //se n existir n posso logar
        }

        const compararSub = await compare(sub, emailExiste.sub); // comparo o sub recebido com o sub que existe na linha onde peguei meu email

        const compararSenha = await compare(pass, emailExiste.password);

        if (!compararSub && !compararSenha) {
            throw new Error("Dados inválidos"); // se n são iguais eu n posso logar
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
        

        const user = {
            name:emailExiste.name,
            email:emailExiste.name,
            photo:emailExiste.photo,
            _id:emailExiste._id,
        }
        
        return {token: token, user:user, sessionToken:emailExiste.sessionToken}; // retorno esse token 
    }
}

export { LogarAdmServives };
