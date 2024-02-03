const mongoose = require("mongoose")

const material = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true,
    },
    currentQuantity:{
        type:Number,
        default:1
    },
    totalQuantity:{
        type:Number,
        default:1
    },
})

module.exports = mongoose.model("material",material)