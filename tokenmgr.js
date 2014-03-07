/*
	PROJECT: web services to be used on IOS app
	Developer: Angel Vittorio Lopez Robles 
	Date: 11/15/2012
	Twitter: @angelvittorio


encrypt and decrypt based on:
http://stackoverflow.com/questions/10548973/encrypting-and-decrypting-with-python-and-nodejs	
*/	 

var hat = require('hat');
var redis = require('redis');
var crypto = require('crypto');

var TIME_OUT = 24 * 60 * 60 ;  //10 minutos en segundos
var password = 'XYXYXYXYXYXYXYXYXYXYXYXYXYXYXYXYX'; //changed for security reasons
/*

*/


var encrypt = function (input, password) {
		var m = crypto.createHash('md5');
		m.update(password)
		var key = m.digest('hex');
		m = crypto.createHash('md5');
		m.update(password + key)
		var iv = m.digest('hex');
		var data = new Buffer(input, 'utf8').toString('binary');
		var cipher = crypto.createCipheriv('aes-256-cbc', key, iv.slice(0,16));
		var encrypted = cipher.update(data, 'binary') + cipher.final('binary');
		var encoded = new Buffer(encrypted, 'binary').toString('base64');
		return encoded;
	};
	
var decrypt = function (input, password) {
    var input = input.replace(/\-/g, '+').replace(/_/g, '/');
    var edata = new Buffer(input, 'base64').toString('binary')
    var m = crypto.createHash('md5');
    m.update(password)
    var key = m.digest('hex');
    m = crypto.createHash('md5');
    m.update(password + key)
    var iv = m.digest('hex');
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv.slice(0,16));
    var decrypted = decipher.update(edata, 'binary') + decipher.final('binary');
    var plaintext = new Buffer(decrypted, 'binary').toString('utf8');
    return plaintext;
};	

TokenMgr = function(){ 
	this.client  = redis.createClient();
	
	this.ReturnUserName = function(hash){
		//return decrypt(hash,password); URL not safety
	}; 
	this.GenerateToken = function(user){
		//return encrypt(user,password); URL not safety
		return hat();
	};
	
	this.GetToken = function(token,callback){
		this.client.get("user:" + token, callback);
	};
	
	this.SetToken = function(User){	
		var cDate = new Date();
		var eDate = new Date();
		eDate.setTime(cDate.getTime() + (TIME_OUT * 1000));
		var token = this.GenerateToken(User);
		this.client.set('user:' + token, User);
		this.client.expire('user:' + token, TIME_OUT );     
		return JSON.stringify({	
					accessToken: token, 
					expirationDate:eDate.getTime()
					});
		};	
};
		

exports.TokenMgr = TokenMgr; 

 
