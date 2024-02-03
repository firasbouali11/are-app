const express = require("express")

const router = express.Router()
const material = require("../models/materials")
const shop = require("../models/shop")

router.get("/",(req,resp)=>{
    material.find()
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.post("/",(req,resp)=>{
    const {name,photo,quantity} = req.body
    if(!name || !photo || !quantity) return resp.status(422).json({error:"missing fields"})
    const mat = new material({
        name,photo,
        totalQuantity:quantity,
        currentQuantity:quantity
    })
    mat.save()
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.patch("/update",(req,resp)=>{
    const {id,name,quantity,photo} = req.body
    material.findByIdAndUpdate(id,{
        name,photo,
        totalQuantity:quantity
    }).then(data => resp.json(data))
    .catch(e =>console.log(e))
})

router.delete("/delete/:id",(req,resp)=>{
    material.findByIdAndDelete(req.params.id)
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

router.post("/userList",(req,resp)=>{
    const {materialId} = req.body
    shop.find({material:materialId}).populate("user","username")
    .then(data => resp.json(data))
    .catch(e => console.log(e))
})

module.exports = router