

//================================
// Puerto
//================================

process.env.PORT = process.env.PORT || 3000   ;

//================================
// Environment
//================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================
// Vencimiento Token
//================================
process.env.CADUCIDAD_TOKEN = '1d';



//================================
// SEED de autenticacion
//================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//================================
// Base de datos
//================================
let urlDB;

if (process.env.NODE_ENV === 'dev'){

    urlDB = 'mongodb://localhost:27017/cafe';

}else{

    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;


//================================
// Client Id Google
//================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '581797866834-8cvbl2g0jrkna4ral56q8cfkuulkr9pp.apps.googleusercontent.com';