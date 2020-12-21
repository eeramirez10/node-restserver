const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const _ = require('underscore');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express.Router();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }

            });
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });

        }

        let usuario = _.pick(usuarioDB, ['id', 'nombre', 'email', 'img', 'role', 'estado'])

        let token = jwt.sign({
            usuario,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario,
            token
        })


    })



});



app.post('/google', async (req, res) => {


    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch( err => {
            return res.status(403).json({
                ok: false,
                err
            });
        })

    Usuario.findOne( { email: googleUser.email }, (err, usuarioDB)=>{

        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(usuarioDB){

            if(!usuarioDB.google){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Debe ser autenticacion normal'
                    }
                });
            }

            let token = jwt.sign({
                usuario:usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN  });

            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })

        }else{

            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)'
            });

            usuario.save((err, usuarioDB)=>{
                
                if (err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN  });
    
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })

        }
    })
    
    


})




async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}






module.exports = app;