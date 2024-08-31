import { Schema } from "mongoose";

const onDay = new Date();


export const recoverySchema: Schema = new Schema({
    admRef:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    cod:{
        type:String,
        required:false
    },
    period:{
        type:Date,
        require:true,
    },
    createDate:{
        type:Date,
        require:true,
        default:onDay
    }
})