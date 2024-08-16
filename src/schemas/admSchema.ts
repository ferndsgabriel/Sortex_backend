import mongoose, { Schema, Document } from 'mongoose';

export const admSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    photo: {
        type: String,
        required: true,
    },
    sub: {
        type: String,
        required: true,
    },
}); // schema de adm