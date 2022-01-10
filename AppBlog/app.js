//carregando modulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)
// config 
    //Template engine 
        var hbs = handlebars.create({
            helpers: {
                sayHello: function () { alert("Hello World") },
                getStringifiedJson: function (value) {
                    return JSON.stringify(value);
                }
            },
            defaultLayout: 'main',
            partialsDir: ['views/'],
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
            partialsDir  : [
                //  path to your partials
                path.join(__dirname, 'views/partials'),
            ]
        });
        app.engine('handlebars', hbs.engine);
        app.set('view engine', 'handlebars');
        app.set('views',  'views');

    // body - parser 
        app.use(bodyParser.urlencoded({extended:false}))
        app.use(bodyParser.json())
    // mongoose 
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp").then(()=>{
            console.log("MongoDB On")
        }).catch((err)=>{
            console.log("Erro de conexão" + err)
        })
    // public 
        app.use(express.static(path.join(__dirname,"public")))                
    //Session 
        app.use(session({
            secret:"xuxu On",
            resave: true, 
            saveUninitialized: true 
        })) 
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash()) 
    // Middleware    
        app.use((req,res,next)=>{
            res.locals.success_msg =   req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })
// Rotas 
        // Main
            app.get("/",(req,res) =>{
                Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens) =>{
                    res.render("index",{postagens:postagens})
                }).catch((err)=>{
                    req.flash("error_msg","Houve um erro interno")
                    res.redirect("/404")
                })   
            })
        // Slug 
            app.get("/postagens/:slug",(req,res)=>{
                Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
                    if(postagem){
                        res.render("postagem/indexpostagens", {postagem:postagem})
                    }else{
                        req.flash("error_msg","Esse Post não existe")
                    res.redirect("/")
                    }
                    
                }).catch((err)=>{
                    req.flash("error_msg","Erro interno ")
                    res.redirect("/")
                })
            })  
        // Categorias 
            app.get("/categorias",(req,res) =>{
                Categoria.find().then((categorias) =>{
                    res.render("categorias/indexcategorias",{categorias:categorias})
                }).catch((err)=>{
                    req.flash("error_msg","Erro interno ao carregar as categorias")
                    res.redirect("/")
                })
            }) 
            app.get("/categorias/:slug",(req,res)=>{
                Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
                    if(categoria){
                        Postagem.find({categoria: categoria._id}).then((postagens)=>{
                            res.render("categorias/postagens",{postagens:postagens, categoria:categoria})
                        }).catch((err)=>{
                            req.flash("error_msg","Erro ao carregar os posts")
                            res.redirect("/")
                        })
                    }else{
                        req.flash("error_msg","Essa categoria não existe")
                        res.redirect("/")
                    }
                }).catch((err)=>{
                    req.flash("error_msg","Erro interno ao carregar essa categoria")
                    res.redirect("/")
                }) 
            })     
        // Admin
            app.use('/admin',admin)
        // Usuarios
            app.use('/usuarios',usuarios)

        // 404 
        app.get("/404", (req, res) =>{
            res.send("Erro 404")
        })    
// Outros
const port = 8081
app.listen(port, ()=>{
    console.log("Server funfando")
})
