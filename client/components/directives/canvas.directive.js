angular.module('chatApp')
       .directive('chatCanvas',[function(){

        var canvas = null;
        var context = null;
        var painting = false;
        var previousMouseX = null;
        var previousMouseY = null;
        var lineWidth = 10;
        var brush = 1;
        var myColor = "#FF0000";

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
            context.lineWidth = 10;
            context.globalAlpha = "0.2";  //NOTE ALWAYS SET TO 'TRANSPARENT' needs variable if you want to switch to solid.
            context.beginPath();
            context.moveTo(previousMouseX, previousMouseY);
            context.lineTo(mouseX, mouseY);
            context.closePath();
            context.stroke();

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

        return {
            restrict : "A",
            scope : {},
            templateUrl: 'components/directives/templates/canvas.html',
            link : function(scope, element, attrs){

                console.log('ran');
                //if(!canvas){
                    console.log('initialized');

                    var jQcanvas = element.find('canvas');
                    canvas = jQcanvas[0];
                    context = canvas.getContext('2d');
                    context.fillStyle = "#FFFFFF";
                    context.fillRect(0, 0, 600, 600);

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

                //}
            },
            controller: function($scope,$rootScope){
                 $scope.sendDraw = function(){
                     console.log('sendImage');
                     $rootScope.$broadcast('SEND_MESSAGE',{
                         message: canvas.toDataURL("image/jpeg", 0.1)
                     });
                 }
            }
        }
    }]);