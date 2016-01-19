angular.module("chatApp")
    .directive("valueMatch",function(){
        return {
            scope : {password : "=against"}, //must be a property
            restrict : "A",
            require : "ngModel", //require the ngModel Controller to use the angularValidation
            link: function(scope, element, attrs, ctrl){
                /* Implementation using a watch and a parser*/
                // Handler for the changes
                    scope.$watch('password',function(){
                        //Send the comparison of the two fields fields to the parser function
                        validateParser(scope.password == element[0].value);
                    });

                    var validateParser = function(value){
                        ctrl.$setValidity("equal", value);
                        ctrl.$setValidity("match", value);
                        return value ? value : undefined;
                    };
                    ctrl.$parsers.push(validateParser);

                    //Validator to take advantage of the customMessage directive
                    ctrl.$validators.match = function(modelValue, viewValue){
                        return (scope.password == viewValue);
                    }

            }
        };
    });
