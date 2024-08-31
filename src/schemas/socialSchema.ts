import { Schema } from "mongoose";

const onDay = new Date();

export const socialSchema :Schema = new Schema({
    admRef:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Administradores'
    },
    instagram:{
        type:String,
        required:false,
    },
    youtube:{
        type:String,
        required:false,
    },
    tiktok:{
        type:{
            type:String,
            required:false,
        }
    },
    twitch:{
        type:String,
        required:false,
    },
    createDate:{
        type:Date,
        require:true,
        default:onDay
    }
})