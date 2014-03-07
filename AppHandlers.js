/*
	PROJECT: web services to be used on IOS app
	Developer: Angel Vittorio Lopez Robles 
	Date: 11/15/2012
	Twitter: @angelvittorio
	
*/	 

var ldap = require('ldapjs');
var sql = require('node-sqlserver');
var TokenManager = require('./tokenmgr');

/*properties*/
var conn_str = "Driver={SQL Server Native Client 11.0};Server=XXXXXXX;Database=DBXXXXX;UID=XYXYXYXYX;Pwd=XYXYXYXYXYX;Connection Timeout=600"; //xxxx put yours here
var TokenMgr = new TokenManager.TokenMgr();
var MSG = 'srv-msg';

// column titles
var EXTPRICE = '"COLUMN1"';
var QTYTO = '"COLUMN2"';
var POQTY = '"COLUMN3"';
var PONET = '"COLUMN4"';

/*Private Methods*/
SendTimeOutResponse = function(res){
		res.setHeader('Content-Type', 'application/json');
		res.send('{"' + MSG + '":"TimeOut"}');
}

VerifyToken = function(token, res, callback){
		TokenMgr.GetToken(token, function(err,resp){
			if (resp !=  undefined){
				callback();
			}
			else{
				SendTimeOutResponse(res);
			}
		});
};

/*Public Methods*/
LoginHandler = function (req, res) {
	 username = req.param("usr");
	 password = req.param("pwd");
	 var client = ldap.createClient({
		url: 'LDAP://LDAPSERVERXXXXX.domainXXX.domainXXX'
	 });
	client.bind(username + '@domainXXX.domainXXX', password, function (err) {
			if(!err){ res.send(TokenMgr.SetToken(username));	}
			else{ res.send('{"' + MSG + '":"Wrong Username or Password"}');}
			});
};

DataHandler = function(req,res){
	accessToken = req.params.accesstoken;
	var title  = req.param("p1");//req.body.title;
	var stroption = req.param("p2");//req.body.subtitle;
	var cllbkFn = req.param("callback");
	
	var option = 0;
	switch(stroption)
			{
			 case "COLUMN1": option = 1 
			 break;
			 case "COLUMN2": option = 2 
			 break;
			 case "COLUMN3": option = 3 
			 break;
			 case "COLUMN4": option = 4 
			 break;
			}
	VerifyToken(accessToken, res, function(){
		res.setHeader('Content-Type', 'application/json');
		sql.open(conn_str, function (err, conn) {
			if (err) {
	//			console.log("Error opening the database connection!");
				return;
			}
	//		console.log("before query!");
			conn.queryRaw("exec dbo.storeProcedureXXXX '" + title + "'", function (err, results) {
				if (err) {
	//				console.log("Error running query!");
					return;
				}
				var itm="";
				if(results.rows.length > 0){
					for (var i = 0; i < results.rows.length; i++) {
							if(i==0){
							if (typeof cllbkFn != "undefined"){ itm = cllbkFn + "(";}
								itm += '{"' + results.rows[i][0] + '":"' + results.rows[i][option] + '"';
							} else {
								itm = itm  + ',"' + results.rows[i][0] + '":"' + results.rows[i][option] + '"';
							}
					}
					itm =  itm + "}";
					if (typeof cllbkFn != "undefined"){ itm += ")";}
					res.send(itm);
				}
				else{
					res.send('{"' + MSG + '":"no results"}');
					console.log("results.rows.length= " +results.rows.length );
				
				}
				conn.close();
			});
		//	console.log("after query!");
		});
	});
};

TableOfContentsHandler = function (req,res){
	accessToken = req.params.accesstoken;
	VerifyToken(accessToken, res, function(){
//			select distinct ITEMNMBR from IV00101 nolock
		res.setHeader('Content-Type', 'application/json'); 
		console.log("before open sql");
		sql.open(conn_str, function (err, conn) {
			if (err) {
				console.log("Error opening the database connection!");
				return;
			};
			//console.log("before execute query");
			*/
			conn.queryRaw("exec dbo.storeProcedureYYYYY", function (err, results) {
				if (err) {
				//	console.log("Error running query!");
					return;
				};
				//console.log("executing");
				var itm;
				if (results.rows.length>0){
					for (var i = 0; i < results.rows.length; i++) {	
						var subtitle = [];
						if(i==0){
							if(results.rows[i][1] > 0 ) subtitle.push(EXTPRICE);
							if(results.rows[i][2] > 0 ) subtitle.push(QTYTO);
							if(results.rows[i][3] > 0 ) subtitle.push(POQTY);
							if(results.rows[i][4] > 0 ) subtitle.push(PONET);
							itm = '{"contents":[{"title":"' + results.rows[i][0] + '","subtitles":[' + subtitle.join(',') + ']}';
						} else {
						
							if(results.rows[i][1] > 0 ) subtitle.push(EXTPRICE);
							if(results.rows[i][2] > 0 ) subtitle.push(QTYTO);
							if(results.rows[i][3] > 0 ) subtitle.push(POQTY);
							if(results.rows[i][4] > 0 ) subtitle.push(PONET);
							itm = itm  + ',{"title":"' + results.rows[i][0] + '","subtitles":[' + subtitle.join(',') + ']}';
						}
					}
					itm =  itm + "]}";
					res.send(itm);
				}
				else{
					res.send('{"' + MSG + '":"no results"}');
				}
			conn.close();
				});
		});
	})
};

TestHandler = function(req,res){
		token = req.param("tkn");
		res.header("Content-Type: text/html");
		res.send("<html><head></head><body><form action='/xxxx/data/" + token + "' method='get'><input type='text' name='title' id='title' value='CSMN-AT3V04' ></input><br /><select name='subtitle'><option value='COLUMN1'>COLUMN1</option><option value='COLUMN2'>COLUMN2</option><option value='COLUMN3'>COLUMN3</option><option value='COLUMN4'>COLUMN4</option></select><br /><input type='text' name='callback' id='callback' value='myCallback'><br /><input type='submit' value='send'></input></form><body></html>");
	};


exports.LoginHandler = LoginHandler;
exports.DataHandler = DataHandler;
exports.TableOfContentsHandler = TableOfContentsHandler;
exports.TestHandler = TestHandler;
