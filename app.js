var express = require('express'),
	app = express.createServer();

exports.init = function(port) {

    app.configure(function(){
    	app.set('views', __dirname + '/views');
    	app.set('view engine', 'ejs');
    	app.use(express.bodyParser());
    	app.use(express.methodOverride());
    	app.use(express.static(__dirname + '/static'));
    	app.use(app.router);
    	app.enable("jsonp callback");
    });

    app.configure('development', function(){
	   app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
        // app.use(express.logger({ format: ':method :url' }));
    });

    app.configure('production', function(){
	   app.use(express.errorHandler()); 
    });


    app.error(function(err, req, res, next){
	   res.render('500.ejs', { locals: { error: err },status: 500 });	
    });

    app.listen(port);

    console.log("Listening on port %d in %s mode", app.address().port, app.settings.env);

    return app;
}