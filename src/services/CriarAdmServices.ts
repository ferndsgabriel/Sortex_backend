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
        // obs... esse sub é um nome que o google da para token que ele gera quando vc faz login com o google, por isso usei esse nome
        // não usei o login do google no backend, vou fazer isso no front, por isso estou já chamando de sub e criando um hash como se fosse uma senha

        const AdmModel = mongoose.model('Administradores',  admSchema); // agora posso fazer operações na tabela adm

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

        await criarAdm.save().catch(()=>{
            throw new Error ('Erro ao criar administrador')
        }) // executo a função

        return {ok:true}
    }
}

export { CriarAdmServices };
