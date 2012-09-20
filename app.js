var express = require('express');

var app = express();

//--------------------configure app----------------------
app.configure(function(){

	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.set('basepath', __dirname);
});

var pub = __dirname + '/public';

app.configure('development', function(){
    app.use(express.static(pub));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(pub, { maxAge: oneYear }));
  app.use(express.errorHandler());
});

app.on('error', function(err) {
	console.error('app on error:' + err.stack);
});
app.listen(7001);
console.log('[AdminConsoleStart] visit http://0.0.0.0:7001');
