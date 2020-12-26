let helpers = {}

const Categoria = require('../models/categoria');

helpers.getIdCategoria = async (req, res, next) =>{

    let categoria = await Categoria.findOne({ descripcion: req.body.categoria })
    .catch(err => console.log(err))

    if(!categoria){
        return res.status(400).json({
            ok:false,
            err:{
                message: `No existe la categoria: ${req.body.categoria} `
            }
        })
    }

    req.body.categoria = categoria._id;

    next();


}



module.exports = helpers;