import mongoose, { Schema, Document } from 'mongoose';

export const cardSchema: Schema = new Schema({
    
    acessToken: {
        type: String,
        required: true,
    },
    admRef:{
        type: Schema.Types.ObjectId,
        ref: 'Administradores', 
        required: true,
    }
}); 