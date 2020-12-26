const express = require('express');
const app = express.Router();
const Producto = require('../models/producto');

const { verificaToken } = require('../middlewares/autenticacion')
const { getIdCategoria } = require('../middlewares/helpers')



// ==============================
// Obtener Productos
// =============================
app.get('/productos', verificaToken, (req, res) => {

    Producto.find({ disponible: true })
        .populate({ path: 'categoria', select: ['descripcion'] })
        .populate({ path: 'usuario', select: ['nombre', 'email'] })
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        })
})


// ==============================
// Buscar Productos
// =============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino
     let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })



})



// ==============================
// Obtener un producto por ID
// =============================





// ==============================
// Crear un nuevo producto
// =============================
app.post('/productos', [verificaToken, getIdCategoria], async (req, res) => {
    let body = req.body;
    let usuario = req.usuario;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuario.id
    })

    producto.save((err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto
        })
    })





});





// ==============================
// Actualizar un producto
// =============================
app.put('/productos/:id', [verificaToken, getIdCategoria], async (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, producto) => {



        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto
        })

    })


})



// ==============================
// Borrar un producto
// =============================

app.delete('/productos/:id', verificaToken, async (req, res) => {
    let id = req.params.id;

    let productoDB = await Producto.findById(id)
        .catch(err => {
            return res.status(400).json({
                ok: false,
                err
            })
        })

    if (!productoDB) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El id no existe'
            }
        })
    }

    if (!productoDB.disponible) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'este producto ya fue eliminado con anterioridad'
            }
        })
    }

    productoDB = await Producto.findByIdAndUpdate(id, { disponible: false })
        .catch(err => {
            return res.status(400).json({
                ok: false,
                err
            })
        })

    res.json({
        ok: true,
        message: `Producto eliminado con el id:${id}`
    })


    /* Producto.findById(id, (err, productoDB)=>{

       

        if (!productoDB){
            return res.status(401).json({
                ok: false,
                err:{
                    message:'No existe el ID'
                }
            })
        }

        if (err){
            return res.status(401).json({
                ok: false,
                err
            })
        }

        if(!productoDB.disponible){
            return res.status(401).json({
                ok: false,
                err:{
                    message:"Este producto ya habia sido eliminado anteriormente"
                }
            })
        }

        let producto = new Producto({
            disponible: false
        })

        Producto.update()

        producto.save((err, productoDB)=>{

            if(err){
                return res.status(401).json({
                    ok: false,
                    err
                })
            }
 

            res.json({
                ok: true,
                message:`Producto eliminado con el id:${id}`
            })

        })



    }) */



})




module.exports = app;