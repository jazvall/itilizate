app.controller('TasksResumeController', function($scope, $sce, ciclosVidaService, nuevoServicioTasks, cambioServicioTasks, restauracionServicioTasks, procesosSustitutos) {
	
	$scope.tasksFlow = [];
	$scope.title = "";

	// Recuperamos los datos de los ciclos de vida
	$scope.ciclosVida = ciclosVidaService.get().ciclosVida;

	// Recuperamos el valor de la operación: 
	// 1 - Nuevo Proceso   2 - Sustitución Proceso    3 - Restauracion Proceso
	$scope.operation = ciclosVidaService.get().operation;

	// Obtenemos el listado de los procesos sustitutos
	procesosSustitutos.list(function(procesosSustitutos) {
        $scope.procesosSustitutos = procesosSustitutos.data;
    });

	// Dependiendo de la operación obtenemos un flujo de tareas u otro
	if ($scope.operation === 1) {
		$scope.title = "Flujo de Actividad para un Nuevo Servicio";
		nuevoServicioTasks.list(function(nuevoServicio) {
        	$scope.tasksFlow = nuevoServicio.data;
        	// Generamos la estructura del pdf y de la vista
	       	 _.each($scope.tasksFlow,createContent);
	    });

	} else if ($scope.operation === 2) {
		$scope.title = "Flujo de Actividad para un Cambio de Servicio";
		cambioServicioTasks.list(function(cambioServicio) {
        	$scope.tasksFlow = cambioServicio.data;
        	// Generamos la estructura del pdf y de la vista
	       	 _.each($scope.tasksFlow,createContent);
	    });

	} else if ($scope.operation === 3) {
		$scope.title = "Flujo de Actividad para una Restauración de Servicio";
		restauracionServicioTasks.list(function(restauracionServicio) {
        	$scope.tasksFlow = restauracionServicio.data;
        	// Generamos la estructura del pdf y de la vista
	       	 _.each($scope.tasksFlow,createContent);
	    });
	}

	// Variable para el contenido del PDF
	$scope.arrayContentPdf = [];
	// Variable para el contenido de la vista
	$scope.arrayContentView = [];

	// Obtiene los responsables de cada una de las tareas del flujo
	var getResponsables = function(data) {
		var arrayResponsables = [];

		// Recorremos todos los procesos responsables y obtenemos su sustituto 
		// en caso de que no esté registrado (no tenga un nivel de madurez superior a 1)
		_.each(data.responsableDefecto,function(proceso) {
	  		var procesoResponsable = undefined; 

	  		// Obtenemos la información del proceso indicado como responsable por defecto
	  		var cicloVida = _.findWhere($scope.ciclosVida, {"id": Number(proceso.id.toString().substring(0,1))});
	  		var procesoDefecto = _.findWhere(cicloVida.procesos, {"id": proceso.id});
	  		
	  		// Miramos el nivel de madurez del proceso.Si es 1 buscar sustito.
	  		if (procesoDefecto.nivelMadurez < 2) {
	  			var procesoSustitutoResponsable = undefined;

	  			// Obtenemos los procesos sustitutos definidos para este proceso
	  			var procesosSustitutos = _.findWhere($scope.procesosSustitutos, {"id": proceso.id});
	  			
	  			//Buscamos entre sus sustitutos el que primero aparezca en su ranking
	  			_.each(procesosSustitutos.sustitutos,function(sustituto) {

	  				// Obtenemos la información del proceso sustituto
	  				var cicloVida1 = _.findWhere($scope.ciclosVida, {"id": Number(sustituto.id.toString().substring(0,1))});
	  				var procesoSustitutoCreado = _.findWhere(cicloVida1.procesos, {"id": sustituto.id});

	  				// Devolvemos el proceso sustituto que aparece en el listado de sustitutos correspondiente para este proceso 
	  				// Para ello se comprueba que coincida el nivel de madurez también
	  				if (!procesoSustitutoResponsable && procesoSustitutoCreado.nivelMadurez == sustituto.nivelMadurez) {
	  					procesoSustitutoResponsable = procesoSustitutoCreado;
	  					return sustituto;
	  				}

	  			});
				
				// Dependiendo de su nivel de madurez se mostrará un texto u otro
				if (procesoSustitutoResponsable.nivelMadurez < 3) {
	  					arrayResponsables.push({ "id": procesoSustitutoResponsable.id, "name": " El responsable de " + procesoSustitutoResponsable.name });
	  			} else {
	  					arrayResponsables.push({ "id": procesoSustitutoResponsable.id, "name": procesoSustitutoResponsable.responsable + " como responsable de " + procesoSustitutoResponsable.name });
	  			}
	  		} else {
	  			// Dependiendo de su nivel de madurez se mostrará un texto u otro
	  			if (procesoDefecto.nivelMadurez < 3) {
	  					arrayResponsables.push({ "id": procesoDefecto.id, "name": " El responsable de " + procesoDefecto.name });
	  			} else {
	  					arrayResponsables.push({ "id": procesoDefecto.id, "name": procesoDefecto.responsable + " como responsable de " + procesoDefecto.name });
	  			}
	  		}
		});

		return arrayResponsables;
	};

	// Obtiene el texto correspondiente a cada tarea
	// Construye el texto del mensaje concatenando el responsable correspondiente con la descripción de la tarea
	var getText = function(data) {

		var partes = data.desc.split("|");
		var arrayText = [];
		// Obtenemos los responsables de la tarea
		var responsables = getResponsables(data);
		var indexResponsable = 0;

		for (var i = 0; i < partes.length; i++) {
			var textPart = partes[i];

			if (textPart.indexOf("{responsable}") !== -1) {
				// Sustituimos la cadena {responsable} por el responsable correspondiente
				textPart = textPart.replace("{responsable}", responsables[indexResponsable].name);
				arrayText.push({ text: textPart, bold: true });
				indexResponsable++;
			} else {
				arrayText.push({ text: textPart});
			}
		}
		return arrayText;
	};

	// Construye el contendido el pdf y de la vista
	var getTextView = function(arrayText) {
	  	var text = "";
	  	_.each(arrayText,function(record) {
	  		if (record.bold) {
	  			text += "<strong>" + record.text+ "</strong> ";
	  		} else {
	  				text +=record.text+ " ";
	  		}
	  	});
	  	return $sce.trustAsHtml(text);
	};

	// Construye el contendido el pdf y de la vista
	var createContent = function(data) {

		// Contruimos el texto para el contenido del PDF
		var arrayText = getText(data);
	  	$scope.arrayContentPdf.push({ text: arrayText, style:"defaultStyle" });

		// Contruimos el texto para el contenido de la vista
	  	data.descHtml = getTextView(arrayText);

	  	// Si la tarea tiene subtareas, contruimos su contenido para pdf y vista
	  	if (data.sublista.length > 0) {

	  		var array2 = [];

	  		_.each(data.sublista,function(data) {
	  			// Contruimos el texto para el contenido del PDF
	  			var arrayText2 = getText(data);
	  			array2.push({ text: arrayText2, style:"defaultStyle" });

	  			// Contruimos el texto para el contenido de la vista
		  		data.descHtml = getTextView(arrayText2);
			});

			// Insertamos la sublista al pdf
			$scope.arrayContentPdf.push( {ul: array2});
		}
	};
	
	// Función para la generación y descarga del pdf.
	$scope.download = function() {

     	var docDefinition = {
     		header: function () {
     			return {
	     			image: 'data:image/png;base64,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',
	                height: 50,
	                width: 100,
	                margin: [50,25]
	            }
	        },
	        footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
	        content: [
			    { 
		            text: $scope.title, 
		            style: 'header' ,
		            padding: [ 5, 2, 10, 20 ]
		        },
		        { 
		            text: 'Siguiendo las recomendaciones de ITIL, a continuación se muestra la secuencia correcta de las tareas y el proceso responsable de su ejecución.', 
		            style: 'bigger' ,
		            alignment: 'justify',
		            padding: [ 5, 2, 10, 20 ]
		        },
		        {
		            ol: $scope.arrayContentPdf
		        },
			],
		   styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [ 5, 2, 10, 20 ]
				},
				bigger: {
					fontSize: 15,
					italics: true,
					margin: [ 5, 2, 10, 20 ]
				},
				defaultStyle: {
						fontSize: 12,
						margin: [ 5, 2, 10, 20 ],
						alignment: 'justify'
				}
			},
		    pageMargins: [50,100,50,50]
		};

			 // download the PDF
			 pdfMake.createPdf(docDefinition).download('FlujoDeActividad.pdf');
       	
    	
    	
    };

    // Función para regresar a la pantalla anterior.
    $scope.back = function() {
    	// Almacenamos el estado de los ciclos de vida y reseteamos el código de operación
		ciclosVidaService.set($scope.ciclosVida,0,"tasks-resume");
		// Redirigimos a la página de procesos
		window.location = "#!process";
	}
});