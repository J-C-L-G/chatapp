angular.module("chatApp")
        .directive("ensureType", function () {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (scope, element, attrs, ctrl) {
                    var regexValidators = {
                        numeric:        "^[0-9]+$",
                        alphabetic:     "^[a-zA-Z ]+$",
                        alphanumeric:   "^[a-zA-Z0-9]+$",
                        date:           "^\\d{4}-\\d{2}-\\d{2}$"
                    };

                    //Validator to check if the value is valid
                    ctrl.$validators.validValue = function (modelValue, viewValue) {
                        var regex;
                        if(attrs['ensure']) {
                            regex = new RegExp(regexValidators[attrs['ensure']],"g");
                        }else{
                            regex = new RegExp(regexValidators[attrs['alphanumeric']],"g");
                        }
                        return regex.test(viewValue);
                    };

                    //Validator to check if the range is valid
                    ctrl.$validators.validRange = function(modelValue, viewValue){
                        if(attrs['ensure'] == 'numeric'){
                            var min = Number(attrs['minvalue'] || 0);
                            var max = Number(attrs['maxvalue'] || 100);
                            return (viewValue >= min && viewValue <= max);
                        }
                        else if(attrs['ensure'] == 'date'){
                            var minDate = new Date(attrs['mindate'] || new Date().setYear( new Date().getFullYear() - (parseFloat(attrs['minvalue']) || 18) ));
                                minDate.setHours(minDate.getHours() - 16);
                            var maxDate = new Date(attrs['maxdate'] || new Date().setYear( new Date().getFullYear() + 92));
                                maxDate.setHours(maxDate.getHours() + 8);
                            var currentDate = new Date(viewValue);
                                currentDate.setHours( new Date().getHours());

                                if(attrs['minage'] == 'true'){
                                    return (currentDate < minDate);
                                }else{
                                    return ((currentDate > minDate) && (currentDate < maxDate));
                                }
                        }
                        //If the field doesn't require a range
                        else{
                            return true;
                        }
                    };
                }
            };
        });