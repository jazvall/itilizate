app.controller('userGuideController', function($scope, nivelesMadurez) {

	
  // Obtenemos el listado de los niveles de madurez
	nivelesMadurez.list(function(nivelesMadurez) {
       $scope.nivelesMadurez = nivelesMadurez.data;
  });


});