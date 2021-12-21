const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/', (req,res)=>{
    res.render("admin/index")
})
router.get("/posts", (req,res)=>{
    res.send("posts")
})
router.get("/categorias", (req,res)=>{
    res.render("admin/categorias")
})
router.get("/categorias/add",(req,res)=>{
    res.render("admin/addCategorias")
})
router.post('/categorias/nova',(req,res)=>{
    const nova_categoria = {
        nome: req.body.nome, 
        slug: req.body.slug
    }
    new Categoria(nova_categoria).save().then(()=>{
        console.log("Categoria cadastrada")
    }).catch((err)=>{
        console.log("Erro ao cadastrar: " + err)
    })
})
module.exports = router