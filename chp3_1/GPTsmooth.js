"use strict";

var canvas;
var gl;

var theta = 40;
var thetaLoc;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    // Initialize the vertices of the square
    var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the vertex data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate shader variables with the data buffer
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // Get the location of the uniform variable `uTheta` in the shader
    thetaLoc = gl.getUniformLocation(program, "uTheta");

    render();
};

function render() {
    setTimeout(function () {
        requestAnimationFrame(render);

        gl.clear(gl.COLOR_BUFFER_BIT);

        // Update the rotation angle
        theta += 0.007;
        gl.uniform1f(thetaLoc, theta);

        // Draw the square
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, 16);
}
