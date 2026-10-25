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
        imageUrl:{
            type:String,
            default:'/images/products/placeholder.jpej'
        }
    },{
        timeseries:true
    }
);

export default mongoose.model('Category',categorySchema)