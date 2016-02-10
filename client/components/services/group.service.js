'use strict';

angular.module('chatApp')
       .factory('Group',['$resource',function($resource){
            return $resource(
                '/api/group/:action',
                {},
                {
                    createGroup : {
                        method:'POST',
                        params:{
                            action:'createGroup'
                        }
                    }
                }
            )
        }]);