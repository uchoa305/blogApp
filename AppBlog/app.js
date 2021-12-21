//carregando modulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")

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

// Rotas 
        // Admin
            app.use('/admin',admin)
// Outros
const port = 8081
app.listen(port, ()=>{
    console.log("Server funfando")
})
