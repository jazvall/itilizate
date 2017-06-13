app.controller('ProcessController', function($scope, $http, $sce, ciclosVida, nivelesMadurez, ciclosVidaService) {

	 $scope.loading = true;
  // Obtenemos el listado de los niveles de madurez
	nivelesMadurez.list(function(nivelesMadurez) {
       $scope.nivelesMadurez = nivelesMadurez.data;
  });

  // Obtenemos los ciclos de vida. Primero comprobamos lo almacenado en sesión antes de cargarlo del json
  // por si viniéramos desde la ventana del listado de tareas
	$scope.ciclosVida = ciclosVidaService.get().ciclosVida;

	if ($scope.ciclosVida.length == 0) {
		ciclosVida.list(function(ciclosVida) {
	        $scope.ciclosVida = ciclosVida.data;
	    });
	}

	
  // Inicializamos el código de operación a 0
  // Los códigos de operación son: 1 - Nuevo Servicio, 2 - Cambio de servicio, 3 - Restauración de servicio
   $scope.operation = 0;
	
  // Inicializamos los valores para el rating del nivel de madurez de los procesos
	$scope.isReadonly = false;
  $scope.changeOnHover = false; 
  $scope.maxValue = 5; 


  // Mostramos un modal panel nada más entrar en la aplicación con un video de ayuda para el uso de la aplicación
  BootstrapDialog.show({
    title: 'Guía Rápida de Usuario',
    type: BootstrapDialog.TYPE_DEFAULT,
    cssClass: 'guide-dialog',
    closable: true,
    message: 'Espera unos segunditos... y ¡dale al play!</br><iframe width="640" height="401" src="http://www.powtoon.com/embed/fMb9KeISNYs/" frameborder="0"></iframe>',
  });

  
  // Al enviar el formulario lo validamos y si es correcto pasamos a la ventana del flujo de actividades
  $scope.submitForm = function() {
    $scope.submitted = true;

    // Obtenemos los posibles errores
    var errorArray = validateForm();
   
    if (this.form.$valid && errorArray.length === 0) {
      // Almacenamos los ciclos de vida y el código de la operación para pasarlo al controlador del flujo de actividades
    	ciclosVidaService.set($scope.ciclosVida, $scope.operation);

      // Redirigimos a la ventana de flujo de actividades
    	window.location = "#!tasks-resume";
     		     	
    } else {
      
      // Mostramos un mensaje de error indicando los posibles errores
    	BootstrapDialog.show({
    		title: 'ERROR',
    		type: BootstrapDialog.TYPE_DANGER,
    		closable: true,
		    message: getErrorText(errorArray),
	      buttons: [{
	                   label: 'OK',
	                    action: function(dialogItself){
	                    dialogItself.close();
	                }
	      }]
	    });
   	}
  };

  // Obtenemos el color definido para el nivel de madurez actual del proceso
  $scope.getGradoMadurezColor = function(nivel) {
   	var nivel = _.find($scope.nivelesMadurez, function(item) {
   		if (item.id == nivel) {
   			return item; 
  		}
  	});

  	return nivel.color;
  };

  // Valida el formulario. Comprueba que:
  // - si el proceso tiene nivel 3 o superior el responsable debe estar informado
  // - al menos un proceso de cada ciclo de vida tenga nivel 2 o superior
  var validateForm = function() {
    var errorArray = [];
    _.each($scope.ciclosVida,function(cicloVida) {
      var errorResponsablesArray = [];
      var flagHasProcess = false;
      _.each(cicloVida.procesos,function(proceso) {
        if (proceso.nivelMadurez > 1) {
          flagHasProcess = true;
        }
        if (proceso.nivelMadurez > 2 && !proceso.responsable) {
          errorResponsablesArray.push(proceso.name);
        }
      });
      if (errorResponsablesArray.length > 0 || !flagHasProcess) {
        errorArray.push({cicloVidaName: cicloVida.name, flagHasProcess: flagHasProcess, erroresResponsable: errorResponsablesArray})
      }
    });
    return errorArray;
  };

  // Contruye el mensaje de error para mostrarlo en el modal panel
  var getErrorText = function(errorArray) {
    var messageResponsables = "";
    var messageflagHasProcess = "";

    _.each(errorArray,function(error) {
      if (!error.flagHasProcess) {
        messageflagHasProcess += "<li><strong>" + error.cicloVidaName + "</strong> debe tener al menos un proceso con nivel 2 o superior. </li>";
      }
      if (error.erroresResponsable.length > 0) {
        messageResponsables += "<li>En <strong>" + error.cicloVidaName + "</strong>";
        messageResponsables += (error.erroresResponsable.length > 1) ? " los procesos " : " el proceso "; 
        messageResponsables += "<strong>" + error.erroresResponsable.join(", ") + "</strong>";
        messageResponsables += (error.erroresResponsable.length > 1) ? " deben " : " debe ";
        messageResponsables += "tener informado un responsable.</li>";
      }
    });

    var errores = "";
    if (messageflagHasProcess != "") {
      errores += "<p>Para cada ciclo de vida es obligatorio que al menos un proceso tenga un nivel de madurez 2 o superior: <ul>";
      errores += messageflagHasProcess;
      errores += "</ul></p>";
    }
    if (messageResponsables != "") {
      errores += "<p>En los procesos con un nivel de madurez 3 o superior es obligatorio definir el responsable:<ul>";
      errores += messageResponsables;
      errores += "</ul></p>";

    }
    return errores;
  };

});