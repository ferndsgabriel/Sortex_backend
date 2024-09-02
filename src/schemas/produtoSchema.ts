import mongoose, { Schema, Document } from 'mongoose';

const onDay = new Date();

export const produtoSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photos: {
        type: [],
        required: true,
    },
    admRef:{
        type: Schema.Types.ObjectId,
        ref: 'Administradores', 
        required: true,
    },
    createDate:{
        type:Date,
        require:true,
        default:onDay
    }
}); 