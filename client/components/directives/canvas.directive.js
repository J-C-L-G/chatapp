angular.module('chatApp')
       .directive('chatCanvas',[function(){

        var canvas = null;
        var context = null;
        var painting = false;
        var previousMouseX = null;
        var previousMouseY = null;

        function getMousePosition(canvas, evt) {

            var rect = canvas.getBoundingClientRect();

            if (evt.clientX !== undefined && evt.clientY !== undefined) {
                return {
                    x: evt.clientX - rect.left,
                    y: evt.clientY - rect.top
                };
            }
        }

        function stroke(mouseX, mouseY) {
            context.globalCompositeOperation = "source-over";
            context.lineJoin = context.lineCap = "round";
            context.globalAlpha = "1";
            context.lineWidth = 6;
            context.beginPath();
            context.moveTo(previousMouseX, previousMouseY);
            context.lineTo(mouseX, mouseY);
            context.closePath();
            context.stroke();

            move(mouseX, mouseY);
        }

        function move(mouseX, mouseY) {
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }

        function clearCanvas(){
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, 600, 600);
        }

        return {
            restrict : "A",
            scope : {},
            templateUrl: 'components/directives/templates/canvas.html',
            link : function(scope, element, attrs){
                    var jQcanvas = element.find('canvas');
                    canvas = jQcanvas[0];
                    context = canvas.getContext('2d');
                    clearCanvas();

                    /**** Attach handler to the Canvas ****/
                    jQcanvas.on('mousedown',function(e){
                        painting = true;
                        var pos = getMousePosition(canvas, e);
                        move(pos.x, pos.y);
                    });

                    jQcanvas.on('mouseup',function(){
                        painting = false;
                    });

                    jQcanvas.on('mousemove',function(e){
                        if(painting) {
                            var pos = getMousePosition(canvas, e);
                            stroke(pos.x, pos.y);
                        }
                    });
            },
            controller: function($scope,$rootScope){
                $scope.colorObject = '';
                $scope.clearCanvas = clearCanvas;
                $scope.$watch('colorObject',function(){
                    context.strokeStyle = $scope.colorObject;
                });
                $scope.sendDraw = function(){
                    $rootScope.$broadcast('SEND_MESSAGE',{
                        message: canvas.toDataURL("image/jpeg", 0.1)
                    });
                };
            }
        }
    }]);