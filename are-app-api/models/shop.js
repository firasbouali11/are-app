const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema.Types

const shop = mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"user",
        required:true
    },
    material:{
        type:ObjectId,
        ref:"material",
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },
    returned:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"waiting for admin",
    }
})

module.exports = mongoose.model("shop",shop)