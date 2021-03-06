var models = require('../models/models.js');

//Autoload :/d de comentarios
exports.load = function(req, res, next, commentId){
	models.Comment.find({
		where: {id: Number(commentId)}
	}). then(function(comment){
		if (comment){
			req.comment = comment;
			next();
		} else {
			next(new Error('No existe el commentId='+commentId))
		}
	}).catch(function(error){next(error)});
};

//GET /quizes/:quizId/comments/new
exports.new = function(req,res){
	res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments
exports.create = function(req,res){
	var comment = models.Comment.build(
		{texto: req.body.comment.texto,
			QuizId: req.params.quizId
		});

	var errors = comment.validate();

	if(errors){
		var i = 0;
		var errores = new Array();
		for (var prop in errors)
			errores[i++]={message:errors[prop]};
		res.render('comments/new.ejs',{comment: comment, quizId: req.params.quizId, errors: err.errors})
	} else {
		comment //guardamos en base de datos el texto
		.save()
		.then(function(){res.redirect('/quizes/'+req.params.quizId)})
	}
};

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req,res){
	req.comment.publicado = true;

	req.comment.save({fields: ["publicado"]})
	.then(function(){res.redirect('/quizes/'+req.params.quizId);})
	.catch(function(error){next(error)});
};


	/*comment
	.validate()
	.then(
		function(err){
			if (err){
				res.render('comments/new.ejs',
				{comment: comment, quizId: req.params.quizId, errors: err.errors});
			} else {
				comment //guardamos en base de datos el texto
				.save()
				.then(function(){res.redirect('/quizes/'+req.params.quizId)})
			}
		}
		). catch (function(error){next(error)});
	}*/
