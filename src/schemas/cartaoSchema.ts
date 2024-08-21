import mongoose, { Schema, Document } from 'mongoose';

export const cardSchema: Schema = new Schema({
    
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
        required: true,
    },
    admRef:{
        type: Schema.Types.ObjectId,
        ref: 'Administradores', 
        required: true,
    }
}); 