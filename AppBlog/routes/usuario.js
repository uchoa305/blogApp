const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const passport = require("passport")

require ("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/registro", (req,res)=>{
    res.render("usuarios/registro")
})
router.get("/login", (req,res)=>{
    res.render("usuarios/login")
})
router.get("/logout", (req,res)=>{
    req.logOut()
    req.flash("success_msg", "Voce saiu do sistema :)")
    res.redirect("/")
})
//post
router.post("/login",(req,res,next)=>{
    passport.authenticate("local", {
        successRedirect: "/" ,
        failureRedirect:"/usuarios/login" , 
        failureFlash: true 
    })(req,res,next)
})
router.post("/registro", (req,res) =>{
    var erros =  []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "email invalido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "senha invalido"})
    }
    if(req.body.senha.length <= 8){
        erros.push({texto:"Senha muito curta"})
    }

    if(req.body.senha != req.body.confirma_senha){
        erros.push({texto: "As senhas são diferentes"})
    }

    if(erros.length > 0 ){
        res.render("usuarios/registro", {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Email já existente")
                res.redirect("/usuarios/registro") 
            }else{
              const novo_usuario  = new Usuario({
                  nome: req.body.nome, 
                  email: req.body.email,
                  senha: req.body.senha, 
              })
              
              bcrypt.genSalt(10, (erro, salt)=>{
                  bcrypt.hash(novo_usuario.senha, salt,(erro, hash)=>{
                        if(erro){
                            req.flash("error_msg","Houve um erro ao salvar os dados")
                            res.redirect("/")
                        }else{
                            novo_usuario.senha = hash
                            novo_usuario.save().then(()=>{
                                req.flash("success_msg","Usuario criado com sucesso")
                                res.redirect("/usuarios/registro")
                            }).catch((err)=>{
                                req.flash("error_msg","Houve um erro ao cadastrar")
                                res.redirect("/")
                            })
                        }
                  })
              })
            }
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

module.exports = router