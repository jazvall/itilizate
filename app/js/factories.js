// Obtiene el listado de los ciclos de vida
app.factory('ciclosVida', function($http){
    return {
        list: function(callback){
            $http.get('data/ciclosVida.json').then(callback);
        }
    };
});

// Obtiene el listado de los niveles de madurez
app.factory('nivelesMadurez', function($http){
    return {
        list: function(callback){
            $http.get('data/nivelesmadurez.json').then(callback);
        }
    };
});

// Obtiene el listado del flujo de actividades para un nuevo servicio
app.factory('nuevoServicioTasks', function($http){
    return {
        list: function(callback){
            $http.get('data/nuevoserviciotasks.json').then(callback);
        }
    };
});

// Obtiene el listado del flujo de actividades para una restauración servicio
app.factory('restauracionServicioTasks', function($http){
    return {
        list: function(callback){
            $http.get('data/restauracionServicioTasks.json').then(callback);
        }
    };
});

// Obtiene el listado del flujo de actividades para un cambio de servicio
app.factory('cambioServicioTasks', function($http){
    return {
        list: function(callback){
            $http.get('data/cambioserviciotasks.json').then(callback);
        }
    };
});

// Obtiene el listado de procesos sustitutos para cada proceso
app.factory('procesosSustitutos', function($http){
    return {
        list: function(callback){
            $http.get('data/procesossustitutos.json').then(callback);
        }
    };
});

// Servicio que almacena el estado actual de los ciclos de vida para su paso entre controladores
app.factory('ciclosVidaService', function() {
	var savedData = {
	 	ciclosVida: [],
	 	operation: 0,
        originView: ""
	};
		
	return {
		set: function(ciclosVida, operation, originView) {
			savedData.ciclosVida = ciclosVida;
			savedData.operation = operation;
            savedData.originView = originView;
		},
		 get: function() {
		    return savedData;
		},
        setOriginView: function(originView) {
            savedData.originView = originView;
        },
	}
});