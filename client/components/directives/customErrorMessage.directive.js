angular.module("chatApp")
        .directive("customErrorMessage",function(){
            return {
                    restrict : "A",
                    require : "ngModel",
                    link : function(scope, element, attrs, ctrl){

                        //Check if was already applied to avoid have duplicates
                        var applied = false;
                        //Create the jQlite element
                        var message = angular.element('<p>');
                        message.addClass("error");
                        //Provide a generic error message or a custom if the user provide one
                        if(attrs['errormessage']){
                            message.text(attrs['errormessage']);
                        }else if(attrs['ensure']){
                            message.text("This fields only accepts " + attrs['ensure'] + " characters please verify the value." )
                        }

                        // Add a validator to ensure that when the value is
                        // not valid the validation message appears
                        ctrl.$validators.showMessage = function(){
                            if(ctrl.$invalid && ctrl.$dirty){
                                if(applied == false){
                                    element.after(message);
                                    applied = true;
                                }
                            }else{
                                message.remove();
                                applied = false;
                            }
                            //Return true to avoid count this as a validation error
                            return true;
                        };
                    }
                };
        });