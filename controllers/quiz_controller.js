var models = require('../models/models.js');

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model:models.Comment}]
	}).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else {next(new Error('No existe quizId='+quizIdz));}
		}
		).catch(function(error){next(error);});
};

//GET /quizes/ :search
exports.index = function(req,res){
	if(req.query.search){
		var search = req.query.search.replace(' ','%');
		models.Quiz.findAll({where:["pregunta like ?",'\%'+search+'\%'],order:'pregunta ASC'}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes, errors: []});
		}).catch(function(error){next(error);})
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes, errors: []});
		}).catch(function(error){next(error);})
	}
};


//GET /quizes/:id
exports.show = function(req,res){
	res.render('quizes/show', {quiz:req.quiz, errors: []});
};


//GET /quizes/:id/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};



//GET /author
exports.author = function(req,res){
	res.render('author',{errors:[]});
};

//GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build( //crea objeto quiz
		{pregunta:"Pregunta", respuesta: "Respuesta", tematica:"Tematica"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build( req.body.quiz);

	var errors = quiz.validate();
	if(errors){
		var i=0;
		var errores = new Array();
		for (var prop in errors) 
			errores[i++]={message:errors[prop]};
		res.render('quizes/new',{quiz:quiz,errors:errores});
	} else {
		quiz.save({fields:["pregunta","respuesta","tematica" ]})
		.then(function(){
			res.redirect('/quizes');
		});
	}
};

//GET quizes /:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz;

	res.render('quizes/edit',{quiz:quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

	var errors = req.quiz.validate();
	if(errors){
		var i = 0;
		var errores = new Array();
		for (var prop in errors)
			errores[i++]={message:errors[prop]};
		res.render('quizes/edit',{quiz:quiz, errors:errores})
	} else {
		req.quiz.save( {fields: ["pregunta","respuesta","tematica"]})
		.then(function(){res.redirect('/quizes');});
	}

};

//DELETE /quizes/:id
exports.destroy = function(req,res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};
