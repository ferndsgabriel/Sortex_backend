import mongoose, { Schema, Document } from 'mongoose';


const onDay = new Date();

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
    password:{
        type: String,
        required: true,
    },
    sessionToken:{
        type:String,
        required:true
    },
    createDate:{
        type:Date,
        require:true,
        default:onDay
    },
}); // schema de adm