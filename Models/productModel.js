import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true,
    },
    slug:{
        type:String,
        lowerCase:true,
    },
    rating:{
        type:String,
    },
    image:{
        type:String,
    },
    price:{
        type:String,
        require:true,
    },
    oPrice:{
        type:String,
        require:true,
    },
    catagory:{
        type:mongoose.ObjectId,
        ref:"category",
        require:true,
    },
    quantity:{
        type:Number,
        require:true,
    },
    shipping:{
        type:Boolean,
    }
},{timestamps:true});

export default mongoose.model('product',productSchema);