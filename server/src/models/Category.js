import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        slug:{
            type:String,
            required:true
        },
        description:{
            type:String,
            default:''
        },
    },{
        timeseries:true
    }
);

export default mongoose.model('Category',categorySchema)