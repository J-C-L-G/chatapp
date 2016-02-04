'use strict';

angular.module('chatApp')
       .factory('UserInterface',['$mdSidenav','$mdDialog',function($mdSidenav, $mdDialog){

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

        //return a promise when the dialog is displayed
        function buildConfirmationDialog(options){
            var confirm = $mdDialog.confirm()
                .title(options.title)
                .textContent(options.textContent)
                .ariaLabel(options.ariaLabel)
                .targetEvent(options.targetEvent)
                .ok(options.ok)
                .cancel(options.cancel);

            return $mdDialog.show(confirm);
        }

            return {
                buildOpen:buildOpen,
                buildClose:buildClose,
                buildToggler:buildToggler,
                buildPanelToggler:buildPanelToggler,
                buildConfirmationDialog:buildConfirmationDialog
            }
        }]);