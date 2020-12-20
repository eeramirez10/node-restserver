


const autenticacion = {}
const jwt = require('jsonwebtoken');

// ===============================
// Verificar token
// ===============================

autenticacion.verificaToken = ( req, res, next )=>{

    let token = req.get('token'); 

    if(!token){
        return res.status(400).json({ 
            ok:false, 
            err:{
                message: 'Es necesario el token'
            }
        })
    } 

    jwt.verify(token,process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }


        req.usuario = decoded.usuario;

        next();

    })

   

};

// ===============================
// Verificar Admin
// ===============================


autenticacion.verificaAdmin_Role = (req, res, next ) => {

    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'El usuario no tiene perimsos para realizar la operacion'
            }
        })
    }

    next();


}







module.exports = autenticacion;