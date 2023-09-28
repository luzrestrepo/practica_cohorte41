const express = require('express')

const jwt = require('jsonwebtoken')

const app = express();

const port = 8000;

app.use(express.json())

const usuario = {
    user: "admin",
    password: "password123"
}

const LLAVE_SECRETA = 'holaAdaSchool';


function rolMiddleware (roles){
    return (req, res, next)=>{
        const rolActual = req.data.rol

        if(roles.includes(rolActual)){
            next()
        }else{
            res.status(401).send('No tienes permiso para acceder')
        }

    }

}



function authMiddleware (req, res, next){
    const token = req.headers.authorization
    
    if (!token){
        res.status(401).send('debes proporcionar un token')
    }

    try {
        const tokenDecripted =jwt.verify(token, LLAVE_SECRETA)
        req.data = tokenDecripted 
        next()
        
    } catch (error) {
        res.status(500).send('ocurrio un error con el token')
    }
}


app.post('/login', (req, res)=>{
    const user = req.body.user
    const pass = req.body.password

    if ( user === usuario.user && pass === usuario.password){
    const pyload = {
        rol: 'vendedor'        
    }

    const token = jwt.sign(pyload,LLAVE_SECRETA )
    return res.status(200).send({
        mesage: 'Bienvenido',
        token
    })


    }else{
        return res.status(403).send({
        mesage:'El usuario o la contraseña son incorrectas' 
    })
}

    


})

app.get('/listar',authMiddleware,rolMiddleware(['cliente']), (req, res)=>{

    res.status(200).send(req.data)

})

app.get('/libros',authMiddleware,rolMiddleware(['vendedor']), (req, res)=>{

    res.status(200).send(req.data)

})



app.listen(port,()=>{
    console.log(`servidor corriendo en http://localhost:${port}`)
})