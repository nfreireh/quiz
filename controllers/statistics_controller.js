var models = require('../models/models.js');

//GET /estadisticas
exports.show = function(req, res){
	models.Quiz.findAll({include: [{model: models.Comment}]}).success(function(result){
		var totalPreguntas = result.length;
		var comentariosTotal = 0;
		var mediaComentarios = 0;
		var preguntasCon = 0;
		var preguntasSin = 0;

		console.log(result.length);
		//console.log(result.rows);

		for (i in result){
			//console.log(result[i].comments);
			if(result[i].comments.length > 0){
				
				preguntasCon ++;
				for (j in result[i].comments){
					comentariosTotal ++;
				}
				
			} else {
				preguntasSin ++;
			}

		}

		if (totalPreguntas > 0){
			mediaComentarios = comentariosTotal/totalPreguntas;
		}

		
	res.render('statistics/show',{
		totalPreguntas: totalPreguntas,
		comentariosTotal: comentariosTotal,
		mediaComentarios: mediaComentarios.toFixed(2),
		preguntasCon: preguntasCon,
		preguntasSin: preguntasSin,
		errors:[]});
	
	}) //.catch(function(error){next(error)});
};


