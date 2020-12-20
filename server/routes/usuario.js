const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const _ = require('underscore');
const usuario = require('../models/usuario');
const app = express.Router()

const { verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion')

app.get('/usuario', [verificaToken], (req, res) => {

    

    let desde = parseInt(req.query.desde) || 0 ;

    let limite = parseInt(req.query.limite)  || 5;

    Usuario.find({ estado:true }, 'nombre email role estado google img ')
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios)=>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            Usuario.countDocuments({ estado: true }, (err,conteo)=>{

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            })


        })

 

});

app.post('/usuario',[verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {



        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        let usuario = {
            ...usuarioDB._doc
        }

        delete usuario.password

        res.json({
            ok: true,
            usuario
        })

    })


});

app.put('/usuario/:id',[verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    
    let body = _.pick(req.body,['nombre','email','img','role','estado']) ;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators:true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })





});

app.delete('/usuario/:id',[verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id,{ estado: false }, { new: true, runValidators:true, context: 'query'}, (err, usuarioBorrado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        let usuario = _.pick(usuarioBorrado, ['nombre','email','img','role','estado'])

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                error :{
                    message:'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario
        })

    })

/*     Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                error :{
                    message:'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    }) */
    

});

module.exports = app;
