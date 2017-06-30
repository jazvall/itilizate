
app.directive('angularIconRating', angularIconRating);
app.directive('showFocus', angularShowFocus);

/* Funciones de la directiva para el rating de niveles de madurez*/
function angularIconRating() {
       var directive = {

        restrict: 'EA',
        scope: {
            'value': 		'=value',
            'max': 			'=max',
            'isReadonly': 	'=isReadonly'
        },
        link: ratingFunction,
        template:
            '<span>' +
            '	<i ng-class="iconClass"' +
            '		ng-repeat="iconClass in iconClassArray"' +
            '		ng-click="setValue($index)" ' +
            ' 		popover="Nivel {{$index+1}}" popover-trigger="mouseenter" ' +
            '				popover-placement="top" popover-append-to-body="true">' +
            '	</i>' +
            '</span>',
        replace: true
    };
    return directive;
}

function ratingFunction(scope, element, attrs, ctrl) {
    if (scope.max === undefined) {
    	scope.max = 5;
    }

    function renderValue() {
        scope.iconClassArray = [];
        for (var i = 0; i < scope.max; i++) {
            if (i < scope.value) {            
                scope.iconClassArray.push({
                    'glyphicon glyphicon-star glyphicon-shadow-big': true
                });
            } else {
                scope.iconClassArray.push({
                    'glyphicon glyphicon-star-empty glyphicon-shadow-big': true
                });
            }
        }
    }

    scope.setValue = function (index) {
        if (!scope.isReadonly && scope.isReadonly !== undefined) {
            scope.value = index + 1;
        }
    };

    scope.$watch('value', function (newValue, oldValue) {
        if (newValue) {
            renderValue();
        }
    });
    scope.$watch('max', function (newValue, oldValue) {
        if (newValue) {
            renderValue();
        }
    });

}


/* Funciones de la directiva para el tooltip dinámico*/
function angularShowFocus($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus, 
          function (newValue) { 
            $timeout(function() {
                newValue && element[0].focus();
            });
        },true);
    }; 
}