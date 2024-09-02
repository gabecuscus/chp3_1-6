"use strict";

var canvas;
var gl;

var theta = 40;
var uThetaLoc;

var direction;

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
    

    /////////////////////////// mouse keys inputs stuff ///////////////////////////////////


    direction = true;
    var button1 = document.getElementById( "DirectionButton" );
    
    button1.addEventListener( "click", function() {
        
        direction = !direction;

    });











    



    //////////////////////////////////////////////////////////////////////////////////////

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
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

    render();
};


function render() {
    setTimeout(function () {
        requestAnimationFrame(render);

        gl.clear(gl.COLOR_BUFFER_BIT);

        // Update the rotation angle
        // theta += 0.007;
        theta += (direction ? 0.007 : -0.007);
        gl.uniform1f(uThetaLoc, theta);

        // Draw the square
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, 16);
}

 // insert //***** */ the sending of theta
        // cus theta is always updating
            // and being sent to GPU


