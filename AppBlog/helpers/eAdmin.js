module.exports = {
    eAdmin: (req, res, next)=>{
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'É necessario ser administrador para acessar essa pagina')
        res.redirect('/')
    }
}