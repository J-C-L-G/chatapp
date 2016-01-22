'use strict';

angular.module('chatApp')
       .factory('UserInterface',['$mdSidenav',function($mdSidenav){

        /**
         * Build handler to open/close/toggle a SideNav; when animation finishes
         * and execute a callback if was provided
         */

        function buildOpen(navID,callback){
            return function(){
                $mdSidenav(navID)
                    .open()
                    .then(callback);
            }
        }

        function buildClose(navID, callback){
            return function(){
                $mdSidenav(navID)
                    .open()
                    .then(callback);
            }
        }

        function buildToggler(navID, callback) {
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(callback);
            }
        }

        //Utility Function to Create a Toggle for a Panel in a View
        function buildPanelToggler(object,property){
            return function(){
                object[property] = (object[property]) ? false : true;
            }
        }

            return {
                buildOpen:buildOpen,
                buildClose:buildClose,
                buildToggler:buildToggler,
                buildPanelToggler:buildPanelToggler
            }
        }]);