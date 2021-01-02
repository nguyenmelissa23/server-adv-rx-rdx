// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
const router = require('./router.js')
dotenv.config({path: './config/config.env'});


process.on('uncaughtException', err => { 
	console.log(err.name, err.message);
	console.log('UNCAUGHT EXCEPTION: Shutting Down...');
	process.exit(1);
})

// DB setup
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace('<dbname>', process.env.DATABASE_NAME);

// console.log(DB); 

mongoose
	.connect(DB, {
		useNewUrlParser: true, 
		useCreateIndex: true, 
		useFindAndModify: false, 
		useUnifiedTopology: true
	})
	.then( conn => { console.log('DB connected successfully')});


// App setup
app.use(morgan('combined')) // Logging framework
app.use(bodyParser.json({type: '*/*'})) // Parse incoming requests to JSON

router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);

// 4. HANDLING PROMISE REJECTION ERRORS
process.on('unhandledRejection', err => {
	console.log(err.name, err.message);
	console.log('UNHANDLER REJECTION: Shutting Down...');
	server.close(() => {
		process.exit(1);
	})
});



