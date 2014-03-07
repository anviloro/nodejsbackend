/*
	PROJECT: web services to be used on IOS app
	Developer: Angel Vittorio Lopez Robles 
	Date: 11/15/2012
	Twitter: @angelvittorio
	
*/	 
var express = require("express");
var handlers  = require('./AppHandlers');
var app = express();
app.use(express.bodyParser());


/*ROUTER RULES xxxx security reasons*/
app.get('/xxxxx/login',handlers.LoginHandler );
app.get('/xxxxx/data/:accesstoken', handlers.DataHandler);
app.get('/xxxxx/data/tableOfContents/:accesstoken', handlers.TableOfContentsHandler);
app.get('/xxxxx/test/',TestHandler);


app.listen(process.env.PORT);
