import mongoose from 'mongoose';


const addressSchema = new mongoose.Schema(
    {
        label:{
            type:String,
            default:'Home'
        },
        line1:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        }
    },{
        _id:true
    }
)

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        passwordHash:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:['customer','admin'],
            default:'customer'
        },
        phone:{
            type:String,
            trim:true
        },
        address:[addressSchema],
    },{
        timestamps:true
    }
);

export default mongoose.model('User',userSchema);