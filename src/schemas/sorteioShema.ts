import { Schema } from "mongoose";

export const sorteioSchema: Schema = new Schema({

    admRef:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Administradores'
    },
    produtoRef:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Produtos'
    },
    cartaoRef:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Cartaos'
    },
    dataInicio:{
        type:Date,
        required:true
    },
    dataTermino:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        require:true
    },
    rifas:{
        type:Array,
        default: []
    },
    title:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        required:true,
        default:false
    },
    winner:{
        type:Number,
        default:null // o winner vai ser um index, pq quando gerar o sorteio e tiver um campeão, vai ser o rifas[winner]
    }
}) 