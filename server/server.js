const config = require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const mongooseSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: true
};


//middleware 
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// habilitar carpeta publi

app.use(express.static( path.join( __dirname, '../public') ));





mongoose.connect(process.env.URLDB,mongooseSettings,(err,res)=>{
    if(err) throw err;

    console.log('Base de datos online')
});

app.use(require('./routes/index'));



app.listen(process.env.PORT, ()=>{
    console.log('Escuchando en el puerto', process.env.PORT);
})