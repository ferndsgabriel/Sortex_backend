import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import 'dotenv/config';
import {formatEmail} from "../utils/formats";
import { admSchema } from '../schemas/admSchema';

// Definindo a interface dos itens do adm
interface admProps {
    name: string;
    email: string;
    photo: string;
    sub: string;
}

// Classe para criar adm
class CriarAdmServices {
    async execute({ name, email, photo, sub }: admProps) {
        if (!name || !email || !photo || !sub) {
            throw new Error('Preencha todos os campos.');
        } // n pode enviar nada vazio

        if (name.length <= 3) {
            throw new Error('Digite um nome válido');
        } // nome precisa de pelo menos 3 caracteres

        const hashsub = await hash(sub, 8); // cria um hash do sub

        const AdmModel = mongoose.model('Administrador',  admSchema); // agora posso fazer operações na tabela adm

        const emailformatado = formatEmail(email); //formatar o emailremovendo espaços e uppercase

        const emailExiste = await AdmModel.findOne({ email:emailformatado}); // verifico se o email está em uso

        if (emailExiste) {
            throw new Error('Email indisponível');
        } // se tiver um email igual retorno um erro

        // Cria um novo usuário
        const criarAdm = new AdmModel({
            name,
            email:emailformatado,
            photo,
            sub: hashsub,
        });

        await criarAdm.save(); // executo a função

        return {ok:true}
    }
}

export { CriarAdmServices };
