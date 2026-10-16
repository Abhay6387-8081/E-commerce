import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true,
        },
        qty:{
            type:Number,
            required:true,
            min:1
        },
    },{
        _id:false
    }
)

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    line1:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true
    }
  },{
    _id:false
  }
);

const orderSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        items:{
            type:[orderItemSchema],
            required:true
        },
        shippingAddress:{
            type:shippingAddressSchema,
            required:true,
        },
        totalAmount:{
            type:Number,
            required:true,
        },
        paymentMethod:{
            type:String,
            enum:['COD'],
            default:'COD'
        },
        status:{
            type:String,
            enum:['pending','confirm','shipped','delivered','cancelled'],
            default:'pending',
        },
    },{
        timestamps:true
    }
);

orderSchema.index({user:1});
orderSchema.index({status:1});

export default mongoose.model('Order',orderSchema)

