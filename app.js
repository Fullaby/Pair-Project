var express = require('express');
var app = express();
var PORT = 3000;
const routes = require('./routes')
const path = require('path')
const session= require('express-session');


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
	secret:'Ayam123',
	resave: false,
	saveUninitialized:false,
	cookie:{
		secure:false,
		sameSite: true
	}
}))

app.use(routes)

app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
