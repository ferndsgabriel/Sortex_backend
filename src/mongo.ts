import mongoose from "mongoose";
import 'dotenv/config';

const uri = process.env.DB_URL as string; //obtendo uri do db

export const connection = mongoose.connect(uri).then(()=>{
    console.log('Banco conectado com sucesso');
}).catch((error)=>{
    console.log(`Erro ao conectar ao db, erro: ${error}`)
}); //configuração de inicialização do banco

