import mongoose, { Schema, Document } from 'mongoose';

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
    price: {
        type: Number,
        required: true,
    },
    admRef:{
        type: Schema.Types.ObjectId,
        ref: 'Administradores', 
        required: true,
    }
}); 