const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const _= require('underscore');
const app = express.Router();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, ( err, usuarioDB )=>{
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(Usuario) o contraseña incorrectos'
                }
                
            });
        }


        if( !bcrypt.compareSync(body.password, usuarioDB.password) ){

            return res.status(400).json({ 
                ok:false,
                err:{
                    message:'Usuario o (contraseña) incorrectos'
                }
            });

        }

        let usuario = _.pick(usuarioDB, ['id','nombre','email','img','role','estado'])

        let token = jwt.sign({
            usuario,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario,
            token
        })


    })



})







module.exports = app;