"use strict";


var canvas;
var gl;

var theta = 40;
var uThetaLoc;
var program;

var thetaRadians;
var thetaDegrees;

var currentTheta = 0;
var targetTheta = 0;

var direction;

var bufferId2c;

window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //
    //  Initialize our data fo de square
    //

    // First, initialize the corners 

    var vertices = [
        vec2(  0, 1 ),
        vec2( -1, 0 ),
        vec2(  1, 0 ),
        vec2(  0,-1 )
    ];

    var colors2 = [
        vec4(1.0, 0.0, 0.0, 1.0),  // Red
        vec4(0.0, 1.0, 0.0, 1.0),  // Green
        vec4(0.0, 0.0, 1.0, 1.0),   // Blue
        vec4(0.0, 0.0, 0.2, 1.0)
    ];
    

    /////////////////////////// mouse keys inputs stuff ///////////////////////////////////

////////// number keys

document.addEventListener("keydown", function( event ){
    
    if(event.key == '1'){
        // console.log("key 1 pressed");
        targetTheta = targetTheta + 0.3 * Math.PI;
    }
    if(event.key == '2'){
        targetTheta = targetTheta - 0.3 * Math.PI;
    }


    if(event.key == '3'){
        targetTheta = targetTheta + 0.9 * Math.PI;
    }
    if(event.key == '4'){
        targetTheta = targetTheta - 0.9 * Math.PI;
    }
    if(event.key == '5'){
        colors2 = colors2.reverse();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2c);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW);
    }
});






////////// mouse


    direction = true;
    var button1 = document.getElementById( "DirectionButton" );
    
    button1.addEventListener( "click", function() {
        
        direction = !direction;

    });

    var moouseClick_tracker = 0;
    canvas.addEventListener( "mousedown", function( event ) {
        moouseClick_tracker++;

        console.log("---------------------------------")
        direction = !direction;
        console.log("current_click", moouseClick_tracker);


        // event stuff
        console.log("----event_____stuff------"/*, event*/);

        var cursorX = event.clientX;
        var cursorY = event.clientY;
        console.log("corsorXY: x:", cursorX, "  y:", cursorY);
        console.log("canvas.offsetLeft: ", canvas.offsetLeft);
        console.log("canvas.offsetTop: ", canvas.offsetTop);

        console.log("canvas.width", canvas.width);
        console.log("canvas.height", canvas.height);

       
    });

    canvas.addEventListener("mousemove", function(event){

        var canvasPos_X = event.clientX - canvas.offsetLeft;
        var canvasPos_Y = event.clientY - canvas.offsetTop;

        var canvasPosUnit_x = canvasPos_X / canvas.width - 0.5;
        var canvasPosUnit_y =  -1 * (canvasPos_Y / canvas.height) + 0.5;

        // console.log("canvas Unit cords    x:", canvasPosUnit_x, "    y:", canvasPosUnit_y);


        // console.log("canvas.   ",event.clientX, event.clientY);





        // // Coordinates
        // var x = 1.0;  // Replace with your x value
        // var y = 1.0;  // Replace with your y value

        // Calculate theta in radians
        thetaRadians = Math.atan2(canvasPosUnit_y, canvasPosUnit_x);
        targetTheta = thetaRadians;


        while(targetTheta - currentTheta > Math.PI){
            targetTheta -= 2 * Math.PI;
        }
        while(targetTheta - currentTheta < -1 * Math.PI){
            targetTheta += 2 * Math.PI;
        }


        // Convert radians to degrees
        thetaDegrees = thetaRadians * (180 / Math.PI);

        // Ensure the angle is between 0 and 360 degrees
        // if (thetaDegrees < 0) {
        //     thetaDegrees += 360;
        // }



    });

   






    



    //////////////////////////////////////////////////////////////////////////////////////

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);


    // Load the data into the GPU

    var bufferId_vertices = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId_vertices );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );


    // Associate our shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );
    /** */
    uThetaLoc = gl.getUniformLocation( program, "uTheta");
    // gl.vertexAttribPointer(uThetaLoc, 1, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray( uThetaLoc );
    /** */


    bufferId2c = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2c);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW);


    render();
};


function render() {
    setTimeout(function () {
        requestAnimationFrame(render);

        gl.clear(gl.COLOR_BUFFER_BIT);

        var vColorLoc = gl.getAttribLocation( program, "vColor");

        // Update the rotation angle
        // theta += 0.007;
        // theta += (direction ? 0.007 : -0.007);

        currentTheta = currentTheta * 0.95 + targetTheta * 0.05; // as time goes one with targettheta being static, that added value will decrease
        // theta = thetaDegrees/100;
        
        theta = currentTheta;
        gl.uniform1f(uThetaLoc, theta);
        // console.log("de final theta sent to GPU", theta);




        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2c);                     ///////
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);    ///////
        gl.enableVertexAttribArray(vColorLoc);  
        // Draw the square
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, 16);
}

 // insert //***** */ the sending of theta
        // cus theta is always updating
            // and being sent to GPU


