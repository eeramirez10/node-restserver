const express = require('express');
const app = express.Router();
const Categoria = require('../models/categoria');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');




app.get('/categoria', verificaToken, (req, res)=>{

    Categoria.find({})
    .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categoria)=>{

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
    
            res.json({
                ok:true,
                categoria
            })

        })
})


app.get('/categoria/:id',verificaToken, (req, res)=>{

    let id = req.params.id;

    Categoria.findById(id, (err, categoria)=>{

        if(!categoria){
            if(err){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'El id no es correcto'
                    }
                })
            }
        }


        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }



        res.json({
            ok:true,
            categoria
        })

    })



})


app.post('/categoria', verificaToken, (req, res)=>{

    let usuario = req.usuario;
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario.id
    });


    categoria.save((err,categoria)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            categoria
        })
    })


})


app.put('/categoria/:id',[verificaToken, verificaAdmin_Role], (req, res)=>{

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators:true }, (err,categoria)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            categoria
        })

    })

})

app.delete('/categoria/:id',[verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id

    Categoria.findByIdAndDelete(id, (err, categoria)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            message: `categoria: ${categoria.descripcion} borrada`
        })
    })

})



module.exports = app;