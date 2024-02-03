const express = require("express")
const md5 = require("md5")
const shop = require("../models/shop")

const router = express.Router()
const User = require("../models/users")
const materials = require("../models/materials")

router.get("/",(req,resp)=>{
    User.find()
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.post("/",(req,resp)=>{
    const {username,password,email,photo,classe} = req.body
    if(!username || !password || !email || !photo || !classe) {
        return resp.status(422).json({error:"missing fields"})
    }
    hashedPassword = md5(password)
    const user = new User({
        username,email,photo,classe,
        password:hashedPassword
    })
    user.save()
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.patch("/:id",(req,resp)=>{
    const {username,email,photo,classe} = req.body
    
    User.updateOne({_id:req.params.id},{
        $set : {
            username,email,photo,classe
        } 
     })
     .then(data => resp.json(data))
     .catch(e => console.log(e))
})

router.delete("/:id",(req,resp)=>{
    User.remove({_id:req.params.id})
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.post("/buyMaterial",(req,resp)=>{
    const {material,user,quantity} = req.body
    const Shop = new shop({
        material,user,quantity
    })
    Shop.save()
    .then(data => resp.json(data))
    .catch(e => console.log(e))
    // materials.findById(material)
    // .then(data => {
    //     materials.updateOne({_id:material},{
    //         $set:{currentQuantity:data.currentQuantity-quantity}
    //     })
    //     .then(a => resp.json(a))
    //     .catch(e => console.log(e))
    // })

})

router.get("/materialsList/:id",(req,resp)=>{
    shop.find({user:req.params.id}).populate("material","name photo")
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.delete("/deleteItem/:id",(req,resp)=>{
    shop.findByIdAndDelete(req.params.id)
    .populate("material")
    .then(data => {
        materials.findByIdAndUpdate(data.material._id,{
            currentQuantity:data.material.currentQuantity + data.quantity
        })
        .then(data => resp.json(data))
        .catch(e => console.log(e))
    })
    .catch(e => console.log(e))
})

router.patch("/itemAccept/:id",(req,resp)=>{    
    shop.findByIdAndUpdate(req.params.id,{
        status:"Accepted"
    })
    .populate("material")
    .then(data=> {
        materials.findByIdAndUpdate(data.material._id,{
            currentQuantity:data.material.currentQuantity - data.quantity
        })
        .then(data => resp.json(data))
        .catch(e => console.log(e))
    })
    .catch(e => console.log(e))
})

router.patch("/itemRefuse/:id",(req,resp)=>{    
    shop.findByIdAndUpdate(req.params.id,{
        status:"Refused"
    })
     .then(data => resp.json(data))
     .catch(e => console.log(e))
})

router.patch("/returnItem/:id",(req,resp)=>{    
    shop.findByIdAndUpdate(req.params.id,{
        status:"waiting to be returned",
        returned:true
    })
     .then(data =>{ resp.json(data)})
     .catch(e => console.log(e))
})

router.get("/requests",(req,resp)=>{
    shop.find()
    .populate("material")
    .populate("user","username photo")
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.get("/returns",(req,resp)=>{
    shop.find({returned:true})
    .populate("material")
    .populate("user","username photo")
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})




module.exports = router