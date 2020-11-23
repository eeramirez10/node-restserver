const config = require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


//middleware
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/usuarios',(req, res) => {

    res.json({
        message:"Hola mundo"
    })

});

app.post('/usuarios',(req, res) => {

    let body = req.body;

    if(body.nombre === undefined){
        res.status(400).json({
            ok:false,
            mensaje:'El nombre es necesario'
        })
    }
    res.json({
        persona: body
    })

});

app.put('/usuarios/:id',(req, res) => {

    let id = req.params.id

    res.json({
        id
    })

});

app.delete('/usuarios',(req, res) => {

    res.json({
        message:"Hola mundo"
    })

});

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando en el puerto', process.env.PORT);
})