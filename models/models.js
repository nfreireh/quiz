var path = require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(null,null,null,
	{dialect:"sqlite",storage:"quiz.sqlite"}
	);

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Exportar la definicion de tabla Quiz
exports.Quiz = Quiz;

//sequelize.sync() crea e inicializa una tabla de preguntas en BD
sequelize.sync().success(function(){
	//success (..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		if(count ===0){
			//la tabla se inicializa si esta vacia
			Quiz.create({  	pregunta: 'Capital de Italia',
							respuesta: 'Roma'
						})
			.success(function(){console.log('Base de datos inicializada')});
		};
	});
});